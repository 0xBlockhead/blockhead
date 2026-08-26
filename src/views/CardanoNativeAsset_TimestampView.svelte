<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.CardanoNativeAsset_Timestamp>, 'prefetched'> = $props()

	const asset = $derived(selection.entitySelector.$asset)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CardanoNativeAssetView from '$/views/CardanoNativeAssetView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoNativeAsset_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'Cardano native asset timestamp'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/native-asset/[policyId=stringSegment]/[assetName=stringSegment]/(cardanoNativeAsset)/observations/[slot=nonNegativeBigInt]/[source=stringSegment]',
				{
					network: (
						'caip2' in asset.$network ?
							caip2StringFromValue(asset.$network.caip2)
						:
							asset.$network.slug
					),
					policyId: asset.policyId,
					assetName: asset.assetName,
					slot: String(selection.entitySelector.slot),
					source: selection.entitySelector.source,
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
				<dt>asset</dt>
				<dd>
					<CardanoNativeAssetView
						selection={select(EntityType.CardanoNativeAsset, selection.entitySelector.$asset)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>slot</dt>
				<dd>
					{selection.entitySelector.slot}
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							timestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={timestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							blockHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockHash = entity.blockHash}
					{#if blockHash != null}
						<div>
							<dt>Block hash</dt>
							<dd>
								<TruncatedValue value={blockHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							supply: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const supply = entity.supply}
					{#if supply != null}
						<div>
							<dt>supply</dt>
							<dd>
								{supply}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionCount = entity.transactionCount}
					{#if transactionCount != null}
						<div>
							<dt>transaction count</dt>
							<dd>
								{transactionCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							holderCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const holderCount = entity.holderCount}
					{#if holderCount != null}
						<div>
							<dt>holder count</dt>
							<dd>
								{holderCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
