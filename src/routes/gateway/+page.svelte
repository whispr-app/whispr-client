<script lang="ts">
	import { libWhispr, authedUser } from '$lib/libWhispr';
	import { goto } from '$app/navigation';
	import { gateway } from '$lib/gateway';

	if (!$authedUser) goto('/login');

	const stream = gateway.streamWritable;
</script>

<div class="message-container">
	{#each $stream as message}
		<div>
			<p>{new Date(JSON.parse(message.data).ts)}</p>
			<code>{message.data}</code>
		</div>
	{/each}
</div>

<style lang="scss">
	.message-container {
		display: flex;
		flex-direction: column-reverse;
		overflow-y: scroll;
		height: 500px;

		div {
			margin: 0.5rem;
			padding: 0.5rem;

			code {
				background-color: #eee;
				padding: 0.5rem;
				border-radius: 0.5rem;
			}
		}
	}
</style>
