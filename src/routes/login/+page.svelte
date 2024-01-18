<script lang="ts">
	import { libWhispr, authedUser } from '$lib/libWhispr';
	import { AxiosError } from 'axios';
	import { goto } from '$app/navigation';

	let username = '';
	let password = '';
	let error = '';

	const signin = async (event: Event) => {
		if (!username || !password) return;
		try {
			await libWhispr.signin(username, password);
		} catch (e) {
			if (e instanceof AxiosError) {
				error = e.response?.data?.message || e.message;
			}
			return;
		}

		(event.target as HTMLFormElement).reset();
		error = '';

		goto('/');
	};
</script>

<form on:submit|preventDefault={signin}>
	<label for="username">Username</label>
	<input type="text" id="username" bind:value={username} />
	<label for="password">Password</label>
	<input type="password" id="password" bind:value={password} />
	<button type="submit">Sign in</button>
</form>

{#if error}
	<p>{error}</p>
{/if}
