<script lang="ts">
	// Types/constants
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()
</script>


<ParentPageCollapsible
	title={'User'}
	href={resolve(`/farcaster/user/${page.params.userId}`)}
	id={page.params.userId}
>
	{@render children()}
</ParentPageCollapsible>
