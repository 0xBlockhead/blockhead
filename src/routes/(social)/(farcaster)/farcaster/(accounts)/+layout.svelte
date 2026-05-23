<script lang="ts">
	// Types/constants
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import { resolve } from '$app/paths'


	// Props
	let { children } = $props()
</script>


<ParentPageCollapsible
	title={'Accounts'}
	href={resolve('/farcaster/accounts')}
>
	{@render children()}
</ParentPageCollapsible>
