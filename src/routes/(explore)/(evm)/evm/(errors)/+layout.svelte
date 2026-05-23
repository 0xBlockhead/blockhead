<script lang="ts">
	// Types/constants
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import { resolve } from '$app/paths'


	// Props
	let { children } = $props()
</script>


<ParentPageCollapsible
	title={'Errors'}
	href={resolve('/evm/errors')}
	id={'evm-errors'}
>
	{@render children()}
</ParentPageCollapsible>
