<script lang="ts">
	// Types/constants
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()
</script>


<ParentPageCollapsible
	title={'Channel'}
	href={resolve(`/farcaster/channel/${page.params.channelId}`)}
	id={page.params.channelId}
>
	{@render children()}
</ParentPageCollapsible>
