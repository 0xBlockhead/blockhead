<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Props
	let { children } = $props()


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	title={'Errors'}
	href={resolve('/evm/errors')}
	id={'evm-errors'}
>
	{@render children()}
</ParentPageCollapsible>
