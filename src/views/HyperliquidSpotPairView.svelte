<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.HyperliquidSpotPair>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import HyperliquidSpotAssetView from '$/views/HyperliquidSpotAssetView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidSpotPair}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/spot-pair/[pairIndex=nonNegativeInteger]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					pairIndex: String(selection.entitySelector.pairIndex),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>pair index</dt>
				<dd>
					{selection.entitySelector.pairIndex}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$baseAsset}
			>
				{#snippet children(hyperliquidSpotAsset)}
					{#if hyperliquidSpotAsset != null}
						<div>
							<dt>base asset</dt>
							<dd>
								<HyperliquidSpotAssetView
									selection={select(EntityType.HyperliquidSpotAsset, hyperliquidSpotAsset[EntityMetaKey.Selector])}
									prefetched={hyperliquidSpotAsset}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$quoteAsset}
			>
				{#snippet children(hyperliquidSpotAsset)}
					{#if hyperliquidSpotAsset != null}
						<div>
							<dt>quote asset</dt>
							<dd>
								<HyperliquidSpotAssetView
									selection={select(EntityType.HyperliquidSpotAsset, hyperliquidSpotAsset[EntityMetaKey.Selector])}
									prefetched={hyperliquidSpotAsset}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
