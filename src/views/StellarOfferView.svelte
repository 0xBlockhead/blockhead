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
	}: Omit<EntitySelectionViewProps<EntityType.StellarOffer>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import StellarNetworkView from '$/views/StellarNetworkView.svelte'
	import StellarAccountView from '$/views/StellarAccountView.svelte'
	import StellarAssetView from '$/views/StellarAssetView.svelte'
</script>


<EntityView
	entityType={EntityType.StellarOffer}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/offer/[offerId=stringSegment]',
				{
					network: (
						'caip2' in selection.entitySelector.$network.$network ?
							caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
						:
							selection.entitySelector.$network.$network.slug
					),
					offerId: selection.entitySelector.offerId,
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
					<StellarNetworkView
						selection={select(EntityType.StellarNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>offer ID</dt>
				<dd>
					{selection.entitySelector.offerId}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$seller}
			>
				{#snippet children(stellarAccount)}
					{#if stellarAccount != null}
						<div>
							<dt>seller</dt>
							<dd>
								<StellarAccountView
									selection={select(EntityType.StellarAccount, stellarAccount[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$sellingAsset}
			>
				{#snippet children(stellarAsset)}
					{#if stellarAsset != null}
						<div>
							<dt>selling asset</dt>
							<dd>
								<StellarAssetView
									selection={select(EntityType.StellarAsset, stellarAsset[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$buyingAsset}
			>
				{#snippet children(stellarAsset)}
					{#if stellarAsset != null}
						<div>
							<dt>buying asset</dt>
							<dd>
								<StellarAssetView
									selection={select(EntityType.StellarAsset, stellarAsset[EntityMetaKey.Selector])}
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
