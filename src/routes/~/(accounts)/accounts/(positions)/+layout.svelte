<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Props
	let { children } = $props()


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	title={'Positions'}
	href={resolve('/~/accounts/positions')}
>
	{@render children()}
</ParentPageCollapsible>
