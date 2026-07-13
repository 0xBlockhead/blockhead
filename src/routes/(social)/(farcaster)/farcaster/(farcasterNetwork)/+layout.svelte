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
	import FarcasterNetworkView from '$/views/FarcasterNetworkView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/farcaster')}
>
	{#snippet Summary()}
		{@const DetailView = FarcasterNetworkView}

		<DetailView
			selection={select(EntityType.FarcasterNetwork, data.selector)}
			href={resolve('/farcaster')}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
