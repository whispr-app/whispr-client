<script lang="ts">
	export let type = '';
	export let placeholder = '';
	export let value: string;
	export let domain = '';

	const SLOTS = $$slots;

	const typeAction = (node: HTMLInputElement) => {
		node.type = type;
	};
</script>

<div class="main">
	{#if SLOTS.default}
		<div class="before">
			<slot />
		</div>
	{/if}
	<input use:typeAction {placeholder} bind:value />
	{#if type === 'username' && domain}
		<span>@{domain}</span>
	{/if}
</div>

<style lang="scss">
	@use '../styles/colours.scss' as colours;

	.main {
		padding: 0.5rem;
		box-sizing: content-box;

		display: flex;
		// justify-content: center;
		align-items: center;

		border-radius: 8px;
		border: 1px solid colours.$outline-100;
		background-color: colours.$background-tertiary-100;

		transition: border 0.2s ease-in-out;

		height: 25px;

		&:focus-within {
			border: 1px solid colours.$outline-highlighted-100;
		}

		.before {
			display: inline-flex;
			justify-content: center;
			align-items: center;
			position: relative;
			left: 0;
			margin: -0.5rem;
			margin-right: 0.25rem;
			padding: 0.5rem;
			height: 100%;
			aspect-ratio: 1;
			background-color: colours.$button-100;

			border-radius: 7px 0 0 7px;
			border-right: 1px solid colours.$outline-100;

			svg {
				width: 100%;
				height: 100%;
			}
		}
	}

	input {
		color: colours.$text-100;

		outline: none;
		background: none;
		border: none;

		font-size: large;

		&::placeholder {
			color: colours.$text-50;
		}
	}
</style>
