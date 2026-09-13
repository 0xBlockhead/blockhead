<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.FinancialProtocol> = $props()

	const network = $derived(selection.entitySelector.$network)
	const titleFallback = $derived((prefetched.name ?? '') || selection.entitySelector.protocolKey || 'financial protocol')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import FinancialProtocol_Amm_EvmBlocksView from '$/views/FinancialProtocol_Amm_EvmBlocksView.svelte'
	import LiquidityPoolsView from '$/views/LiquidityPoolsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.FinancialProtocol}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/financial-protocol/[protocolKey=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					protocolKey: selection.entitySelector.protocolKey,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary
			resource={
				selection({
					sources: selection.sources ?? [
						Source.TheGraph_Graphql,
					],
					fields: {
						name: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{entity.name || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.protocolKey}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet Details()}
		{@const ammBlocksResource = selection
			.$$ammBlocks({
				sources: [
					Source.TheGraph_Graphql,
				],
			})}
		<ResourceBoundary
			resource={ammBlocksResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FinancialProtocol_Amm_EvmBlocksView
						selection={ammBlocksResource}
						countResource={ammBlocksResource.count}
						title='AMM financial observations'
						id='amm-blocks'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const liquidityPoolsResource = selection
			.$$liquidityPools({
				sources: [
					Source.TheGraph_Graphql,
				],
			})}
		<ResourceBoundary
			resource={liquidityPoolsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<LiquidityPoolsView
						selection={liquidityPoolsResource}
						countResource={liquidityPoolsResource.count}
						title='Liquidity pools'
						id='liquidity-pools'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
