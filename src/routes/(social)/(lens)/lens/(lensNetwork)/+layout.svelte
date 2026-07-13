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
	import LensNetworkView from '$/views/LensNetworkView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/lens')}
>
	{#snippet Summary()}
		{@const DetailView = LensNetworkView}

		<DetailView
			selection={select(EntityType.LensNetwork, data.selector)}
			href={resolve('/lens')}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
