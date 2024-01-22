<script lang="ts">
	import { goto } from '$app/navigation';
	import { libWhispr, authedUser } from '$lib/libWhispr';
	import axios, { AxiosError } from 'axios';

	let userShown = false;

	axios.interceptors.request.use((config) => {
		if ($authedUser) config.headers['Authorization'] = `Bearer ${$authedUser.token}`;
		return config;
	});

	axios.interceptors.response.use(
		(response) => response,
		async (error) => {
			console.log(error);

			if (error.response?.status === 401 && !error.config.url?.includes('/auth/sign-out')) {
				await libWhispr.signout();
			}
			if (error.config.url?.includes('/auth/sign-out')) {
				libWhispr.authStore = null;
				authedUser.set(null);
			}
			return Promise.reject(error);
		}
	);

	let error = '';

	const getUser = async () => {
		if ($authedUser) return await libWhispr.getUser($authedUser?.username);
	};

	const signout = async () => {
		try {
			await libWhispr.signout();
			goto('/');
			window.location.reload();
		} catch (e) {
			if (e instanceof AxiosError) {
				error = e.response?.data?.message || e.message;
			}
			return;
		}
	};
</script>

<a href="/">home</a>

<slot />

{#if $authedUser}
	<p>Logged in as {$authedUser.username}@{window.location.hostname}</p>
	<button on:click={signout}>Sign out</button>
	<button
		on:click={() => {
			userShown = !userShown;
		}}>Show/hide user</button
	>
	{#if userShown}
		{#await getUser()}
			<p>Loading...</p>
		{:then user}
			<p>nickname: {user.nickname}</p>
			<p>public key:</p>
			<pre>{$authedUser.publicKey}</pre>
			<p>private key:</p>
			<pre>{$authedUser.privateKey}</pre>
		{:catch error}
			<p>{error}</p>
		{/await}
	{/if}
{/if}

{#if error}
	<p>{error}</p>
{/if}
