<script lang="ts">
	import type { Snippet } from 'svelte'

	let {
		children,
		params,
	}: {
		children: Snippet
		params: {
			connectionId: string
		}
	} = $props()

	import FarcasterAccountControl from '../../FarcasterAccountControl.svelte'
</script>


<FarcasterAccountControl connectionId={params.connectionId} />

{@render children()}
