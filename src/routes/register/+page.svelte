<script lang="ts">
	import { goto } from '$app/navigation';
	import Input from '$lib/components/Input.svelte';
	import Modal from '$lib/components/structure/Modal.svelte';
	import WhisprLogoWhite from '$lib/components/whispr-logo-white.svelte';
	import { libWhispr, authedUser } from '$lib/libWhispr';

	let username = '';
	let password = '';
	let passwordConfirm = '';
	let nickname = '';

	const register = async () => {
		if (!nickname || !password || !username) return;

		if (password !== passwordConfirm) return;

		await libWhispr.register(password, nickname, username);

		goto('/');
	};
</script>

<main>
	<div class="logo">
		<WhisprLogoWhite />
	</div>
	<Modal>
		<form on:submit|preventDefault={register}>
			<h1>Register</h1>
			<p>Create some credentials</p>
			<Input
				type="username"
				placeholder="Username"
				bind:value={username}
				domain={window.location.hostname}
			></Input>
			<Input type="password" placeholder="Password" bind:value={password} />
			<Input type="password" placeholder="Confirm Password" bind:value={passwordConfirm} />
			<p>What do you call yourself?</p>
			<Input type="text" placeholder="Nickname" bind:value={nickname} />
			<button type="submit">Register</button>
			<p>Already have an account?</p>
			<a href="/login">Login here</a>
		</form>
	</Modal>
</main>

<style lang="scss">
	h1,
	p,
	a {
		margin: 0;
	}
	main {
		width: 100vw;
		height: 100vh;
		background-image: url('/wave.svg');
		background-repeat: no-repeat;
		background-size: cover;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		* {
			text-align: center;
		}
	}

	.logo {
		width: 150px;
		position: absolute;
		bottom: 0;
		left: 10px;
	}
</style>
