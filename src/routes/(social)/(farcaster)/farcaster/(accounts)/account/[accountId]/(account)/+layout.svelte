<script lang="ts">
	// Types/constants
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()
</script>


<ParentPageCollapsible
	title={'Account'}
	href={resolve(`/farcaster/account/${page.params.accountId}`)}
	id={page.params.accountId}
>
	{@render children()}
</ParentPageCollapsible>
