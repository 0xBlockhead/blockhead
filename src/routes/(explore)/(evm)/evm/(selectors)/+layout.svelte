<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let { children } = $props()


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	title="Selectors"
	href={resolve('/evm/selectors')}
	id="evm-selectors"
>
	{@render children()}
</ParentPageCollapsible>
