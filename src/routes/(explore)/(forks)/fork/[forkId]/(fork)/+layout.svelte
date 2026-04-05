<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import type { LayoutProps } from './$types'


	// State
	let {
		children,
		params,
	}: LayoutProps = $props()


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	title={'Fork'}
	href={resolve('/(explore)/(forks)/fork/[forkId]', params)}
	id={params.forkId}
>
	{@render children()}
</ParentPageCollapsible>
