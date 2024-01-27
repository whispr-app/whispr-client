<script lang="ts">
	import { goto } from '$app/navigation';
	import { libWhispr, authedUser } from '$lib/libWhispr';
	import axios, { AxiosError } from 'axios';

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

	// const signout = async () => {
	// 	try {
	// 		await libWhispr.signout();
	// 		goto('/');
	// 		window.location.reload();
	// 	} catch (e) {
	// 		if (e instanceof AxiosError) {
	// 			error = e.response?.data?.message || e.message;
	// 		}
	// 		return;
	// 	}
	// };
</script>

<slot />

<style lang="scss">
	@use '$lib/styles/colours.scss' as colours;
	@import url('https://fonts.nexus/css?display=swap&family=Bootstrap+Icons');

	@font-face {
		font-family: 'Mona Sans';
		src:
			url('Mona-Sans.woff2') format('woff2 supports variations'),
			url('Mona-Sans.woff2') format('woff2-variations');
		font-weight: 200 900;
		font-stretch: 75% 125%;
	}

	:global(html) {
		font-family: 'Mona Sans';
		padding: 0;
		margin: 0;
	}

	:global(body) {
		padding: 0;
		margin: 0;
		width: 100%;
		height: 100%;
		background-color: colours.$background-100;
		color: colours.$text-100;
	}

	:global(a) {
		color: colours.$primary-100;
	}

	:global(*) {
		font-weight: 300;
		font-stretch: 100%;
	}
	:global(h1) {
		font-weight: 800;
		font-stretch: 125%;
	}
	:global(h2) {
		font-weight: 500;
		font-stretch: 125%;
	}

	:global(.icon) {
		scale: 1.5;
		width: 100%;
		height: 100%;
		display: inline-block;
		// justify-content: center;
		// align-items: center;
		// text-align: center;
		vertical-align: middle;

		&::before {
			vertical-align: -5px;
		}
	}

	:global(button) {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0.5rem;

		font-size: large;
		width: fit-content;

		background-color: colours.$button-100;
		color: colours.$text-100;
		border-radius: 8px;
		border: 1px solid colours.$outline-100;

		transition: border 0.2s ease-in-out;

		&:hover {
			border: 1px solid colours.$outline-highlighted-100;
			cursor: pointer;
		}

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}
</style>
