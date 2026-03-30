<script lang="ts">
	// Types/constants
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import { resolve } from '$app/paths'


	// State
	let { children } = $props()
</script>


<ParentPageCollapsible
	title={'Channels'}
	href={resolve('/farcaster/channels')}
>
	{@render children()}
</ParentPageCollapsible>
