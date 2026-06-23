<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let { children } = $props()


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	title="EVM"
	href={resolve('/evm')}
	id="evm"
>
	{@render children()}
</ParentPageCollapsible>
