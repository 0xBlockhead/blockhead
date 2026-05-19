<script lang="ts">
	// Context
	import { resolve } from '$app/paths'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'

	let { children } = $props()
</script>


<ParentPageCollapsible
	title={'Markets'}
	href={resolve('/markets')}
>
	{@render children()}
</ParentPageCollapsible>
