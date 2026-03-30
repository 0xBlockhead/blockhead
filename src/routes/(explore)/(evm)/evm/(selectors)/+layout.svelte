<script lang="ts">
	// Types/constants
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import { resolve } from '$app/paths'


	// State
	let { children } = $props()
</script>


<ParentPageCollapsible
	title={'Selectors'}
	href={resolve('/evm/selectors')}
	id={'evm-selectors'}
>
	{@render children()}
</ParentPageCollapsible>
