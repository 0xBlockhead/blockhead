<!-- Generated from APP.ts. -->

<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let { children } = $props()


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	title='Calldata'
	href={resolve('/evm/calldata-decoder')}
>
	{@render children()}
</ParentPageCollapsible>
