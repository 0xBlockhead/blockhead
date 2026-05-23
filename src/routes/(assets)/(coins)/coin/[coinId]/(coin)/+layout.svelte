<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Props
	let { children } = $props()


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	title={'Coins'}
	href={resolve('/coins')}
	id={'coins'}
>
	{@render children()}
</ParentPageCollapsible>
