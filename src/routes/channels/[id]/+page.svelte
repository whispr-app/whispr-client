<script lang="ts">
	import { page } from '$app/stores';
	import { libWhispr, authedUser } from '$lib/libWhispr.js';
	import axios from 'axios';
	import { goto } from '$app/navigation';
	import { gateway } from '$lib/gateway';
	import { onDestroy, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { GatewayServerEvent, OpCode } from '$lib/gatewayTypes.js';

	if (!$authedUser) {
		goto('/login');
	}

	export let data;

	let mounted = false;
	onMount(() => {
		mounted = true;
	});
	onDestroy(() => {
		mounted = false;
	});

	$: id = data.slug;

	const getNameFromUsers = (
		users: {
			user: {
				id: string;
				usermame: string;
				nickname: string;
			};
		}[]
	) => {
		return users.find((user) => user.user.id !== $authedUser?.userId)?.user.nickname;
	};

	// create channel dialog
	let dialog: HTMLDialogElement;
	let username = '';

	const createChannel = async () => {
		if (!username) return;
		const user = await libWhispr.getUser(username).catch((e) => {
			console.log(e);
			return;
		});

		if (!user) return;

		// TODO: Error handling
		const response = await libWhispr.createChannel([user.id]);

		dialog.close();
		username = '';

		window.location.reload();
	};

	// Messages
	type Message = {
		id: string;
		channelId?: string;
		createdAt: string;
		updatedAt: string;
		author: {
			id: string;
			username: string;
			nickname: string;
			keyPair: {
				publicKey: string;
			};
		};
		content: {
			id: string;
			cipherText: string;
			targetUserId: string;
			messageId: string;
			encryptedSymmetricKey: string;
		};
	};
	const _messages: Message[] = [];
	const messages = writable(_messages);
	const stream = gateway.streamWritable;

	let message = '';

	const sendMessage = async () => {
		if (!message) return;
		if (message.length > 2000) return;
		await libWhispr.sendMessage(id, message);
		message = '';
	};

	$: {
		_messages.length = 0;
		messages.set(_messages);

		if (mounted && id !== '@self') {
			libWhispr.fetchMessages(id).then((response) => {
				for (const message of response) {
					// console.log(message);

					_messages.push(message);
					messages.set(_messages);
				}
			});
		}
	}

	stream.subscribe((msgs) => {
		if (!mounted) return;

		const message = msgs[0];

		const parsed = JSON.parse(message.data);

		// console.log(parsed);

		if (parsed.op === OpCode.Notification) {
			switch (parsed.t) {
				case GatewayServerEvent.MessageCreate: {
					parsed.d.content = parsed.d.content.find(
						(content: {
							id: string;
							cipherText: string;
							targetUserId: string;
							messageId: string;
							encryptedSymmetricKey: string;
						}) => content.targetUserId === $authedUser?.userId
					);
					const message = parsed.d as Message;

					if (message.channelId === id) {
						_messages.unshift(message);
						messages.set(_messages);
					}
					break;
				}
			}
		}
	});

	const signout = async () => {
		try {
			await libWhispr.signout();
			goto('/');
			window.location.reload();
		} catch (e) {}
	};
</script>

<button on:click={signout}> sign out (TEMP) </button>

{#if id === '@self'}
	<h1>Channels</h1>
	{#await libWhispr.getChannels() then channels}
		{#each channels as channel}
			<a href="/channels/{channel.id}"
				>{channel.userChannelPermissions.length === 2
					? getNameFromUsers(channel.userChannelPermissions)
					: channel.name}</a
			>
			<br />
		{/each}
		<br />
		<button
			on:click={() => {
				dialog.showModal();
			}}>Create a new channel</button
		>
		<dialog bind:this={dialog}>
			<b>Create a channel</b>
			<form on:submit|preventDefault={createChannel} method="dialog">
				<label for="name">Username</label>
				<input type="text" id="name" bind:value={username} />
				<button type="submit">Create</button>
			</form>
			<button
				on:click={() => {
					dialog.close();
				}}>Close</button
			>
		</dialog>
	{:catch error}
		<p>{error.message}</p>
	{/await}
{:else}
	{#await libWhispr.getChannel(id) then channel}
		<h1>
			{channel.userChannelPermissions.length === 2
				? getNameFromUsers(channel.userChannelPermissions)
				: channel.name}
		</h1>
		<a href="/channels/@self">Back to channels</a>
		<div class="message-container">
			{#each $messages as message}
				{#if message.content}
					<div>
						<p>{new Date(message.createdAt)} • {message.author.nickname}</p>
						{#await libWhispr.decryptMessageContent(message.content.cipherText, message.author, message.content.encryptedSymmetricKey) then decryptedMessage}
							<p>{decryptedMessage}</p>
						{:catch error}
							<p>{error.message}</p>
						{/await}
					</div>
				{/if}
			{/each}
		</div>
		<form on:submit|preventDefault={sendMessage}>
			<input type="text" bind:value={message} />
			<button type="submit">Send</button>
		</form>
	{:catch error}
		<p>{error.message}</p>
	{/await}
{/if}

<style lang="scss">
	.message-container {
		display: flex;
		flex-direction: column-reverse;
		overflow-y: scroll;
		height: 500px;
		width: 100%;

		div {
			margin: 0.5rem;
			padding: 0.5rem;
		}
	}
</style>
