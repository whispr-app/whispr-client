<script lang="ts">
	import { goto } from '$app/navigation';
	import { authedUser } from '$lib/libWhispr.js';

	if ($authedUser) {
		goto('/channels/@self');
	} else {
		goto('/login');
	}
</script>
