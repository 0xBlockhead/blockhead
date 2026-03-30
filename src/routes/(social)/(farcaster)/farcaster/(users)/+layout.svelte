<script lang="ts">
	// Types/constants
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import { resolve } from '$app/paths'


	// State
	let { children } = $props()
</script>


<ParentPageCollapsible
	title={'Users'}
	href={resolve('/farcaster/users')}
>
	{@render children()}
</ParentPageCollapsible>
