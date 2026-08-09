<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.ElementsAsset_Timestamp>, 'prefetched'> = $props()

	const asset = $derived(selection.entitySelector.$asset)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Esplora_Rest,
		],
	}))
	const elementsAssetTimestamp = $derived(viewSelection({
		fields: {
			issuedAmount: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import ElementsAssetView from '$/views/ElementsAssetView.svelte'
</script>


<EntityView
	entityType={EntityType.ElementsAsset_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(elements)/elements/asset/[assetId=stringSegment]/(elementsAsset)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in asset.$network.$network ?
							caip2StringFromValue(asset.$network.$network.caip2)
						:
							asset.$network.$network.slug
					),
					assetId: asset.assetId,
					timestampMs: String(selection.entitySelector.timestampMs),
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
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={elementsAssetTimestamp}>
			{#snippet children(entity)}
				{@const issuedAmount = entity.issuedAmount}
				{#if issuedAmount != null}
					<NumberValue
						value={issuedAmount}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Asset</dt>
				<dd>
					<ElementsAssetView
						selection={select(EntityType.ElementsAsset, selection.entitySelector.$asset)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={elementsAssetTimestamp}
			>
				{#snippet children(entity)}
					{@const issuedAmount = entity.issuedAmount}
					{#if issuedAmount != null}
						<div>
							<dt>Issued amount</dt>
							<dd>
								<NumberValue
									value={issuedAmount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							burnedAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const burnedAmount = entity.burnedAmount}
					{#if burnedAmount != null}
						<div>
							<dt>Burned amount</dt>
							<dd>
								<NumberValue
									value={burnedAmount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							reissuanceTokenCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const reissuanceTokenCount = entity.reissuanceTokenCount}
					{#if reissuanceTokenCount != null}
						<div>
							<dt>Reissuance tokens</dt>
							<dd>
								<NumberValue
									value={reissuanceTokenCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
