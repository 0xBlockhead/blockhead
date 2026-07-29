<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.ElementsAsset_Timestamp> = $props()

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

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Asset</dt>
				<dd>
					<ElementsAssetView
						selection={select(EntityType.ElementsAsset, selection.entitySelector.$asset)}
						layout={EntityLayout.Value}
						open={false}
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
