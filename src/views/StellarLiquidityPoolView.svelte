<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.StellarLiquidityPool> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import StellarNetworkView from '$/views/StellarNetworkView.svelte'
	import StellarAssetView from '$/views/StellarAssetView.svelte'
</script>


<EntityView
	entityType={EntityType.StellarLiquidityPool}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<StellarNetworkView
						selection={select(EntityType.StellarNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>liquidity pool ID</dt>
				<dd>
					{selection.entitySelector.liquidityPoolId}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							poolType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const poolType = entity.poolType}
					{#if poolType != null}
						<div>
							<dt>pool type</dt>
							<dd>
								{poolType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$assetA}
			>
				{#snippet children(stellarAsset)}
					{#if stellarAsset != null}
						<div>
							<dt>asset a</dt>
							<dd>
								<StellarAssetView
									selection={select(EntityType.StellarAsset, stellarAsset[EntityMetaKey.Selector])}
									prefetched={stellarAsset}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$assetB}
			>
				{#snippet children(stellarAsset)}
					{#if stellarAsset != null}
						<div>
							<dt>asset b</dt>
							<dd>
								<StellarAssetView
									selection={select(EntityType.StellarAsset, stellarAsset[EntityMetaKey.Selector])}
									prefetched={stellarAsset}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feeBps: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feeBps = entity.feeBps}
					{#if feeBps != null}
						<div>
							<dt>fee bps</dt>
							<dd>
								{feeBps}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
