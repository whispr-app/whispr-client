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
</style>
