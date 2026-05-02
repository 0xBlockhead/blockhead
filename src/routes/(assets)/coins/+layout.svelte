<script lang="ts">
	// Context
	import { resolve } from '$app/paths'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'

	let { children } = $props()
</script>


<ParentPageCollapsible
	title={'Coins'}
	href={resolve('/coins')}
>
	{@render children()}
</ParentPageCollapsible>
