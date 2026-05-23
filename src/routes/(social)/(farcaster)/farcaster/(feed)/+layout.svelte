<script lang="ts">
	// Types/constants
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import { resolve } from '$app/paths'


	// Props
	let { children } = $props()
</script>


<ParentPageCollapsible
	title={'Feed'}
	href={resolve('/farcaster/feed')}
>
	{@render children()}
</ParentPageCollapsible>
