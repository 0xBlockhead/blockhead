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
	title={'Agent'}
	href={resolve('/(explore)/(agents)/agent/[agentId]', params)}
	id={params.agentId}
>
	{@render children()}
</ParentPageCollapsible>
