<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let { children } = $props()


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	title="Calldata"
	href={resolve('/evm/calldata')}
	id="evm-calldata"
>
	{@render children()}
</ParentPageCollapsible>
