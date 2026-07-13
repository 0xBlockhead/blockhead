<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import GlobalSwarmAccessView from '$/views/_GlobalSwarmAccessView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/swarm/access')}
>
	{#snippet Summary()}
		{@const DetailView = GlobalSwarmAccessView}

		<DetailView
			selection={select(EntityType._GlobalSwarmAccess, data.selector)}
			href={resolve('/swarm/access')}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
