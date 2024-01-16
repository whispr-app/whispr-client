<script lang="ts">
	import { goto } from '$app/navigation';
	import { libWhispr, authedUser } from '$lib/libWhispr';

	let username = '';
	let password = '';
	let nickname = '';

	const register = async () => {
		if (!nickname || !password) return;

		await libWhispr.register(password, nickname, username);

		goto('/');
	};
</script>

<form on:submit|preventDefault={register}>
	<label for="username">Username</label>
	<input type="text" id="username" bind:value={username} />
	<label for="password">Password</label>
	<input type="password" id="password" bind:value={password} />
	<label for="nickname">Nickname</label>
	<input type="text" id="nickname" bind:value={nickname} />
	<button type="submit">Register</button>
</form>
