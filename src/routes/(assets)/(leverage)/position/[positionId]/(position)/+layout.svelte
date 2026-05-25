<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let { children } = $props()


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	title={'Leverage'}
	href={resolve('/leverage')}
	id={'leverage'}
>
	{@render children()}
</ParentPageCollapsible>
