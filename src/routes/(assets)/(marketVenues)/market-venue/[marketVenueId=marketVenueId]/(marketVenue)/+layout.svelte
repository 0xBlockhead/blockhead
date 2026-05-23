<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Props
	let { children } = $props()


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	title={'Market venues'}
	href={resolve('/market-venues')}
	id={'market-venues'}
>
	{@render children()}
</ParentPageCollapsible>
