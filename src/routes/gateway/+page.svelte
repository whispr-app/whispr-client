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
			<pre>{JSON.stringify(JSON.parse(message.data), null, 2)}</pre>
		</div>
	{/each}
</div>

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

			pre {
				background-color: #eee;
				padding: 0.5rem;
				border-radius: 0.5rem;

				white-space: pre-wrap; /* Since CSS 2.1 */
				white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
				white-space: -pre-wrap; /* Opera 4-6 */
				white-space: -o-pre-wrap; /* Opera 7 */
				word-wrap: break-word;
			}
		}
	}
</style>
