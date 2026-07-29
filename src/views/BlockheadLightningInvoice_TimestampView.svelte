<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.BlockheadLightningInvoice_Timestamp> = $props()

	const blockheadLightningInvoiceTimestamp = $derived(selection({
		fields: {
			state: true,
			amountPaidMsat: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadLightningInvoiceView from '$/views/BlockheadLightningInvoiceView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLightningInvoice_Timestamp}
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
		<ResourceBoundary resource={blockheadLightningInvoiceTimestamp}>
			{#snippet children(entity)}
				{[(entity.state ?? ''), String(entity.amountPaidMsat ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Invoice</dt>
				<dd>
					<BlockheadLightningInvoiceView
						selection={select(EntityType.BlockheadLightningInvoice, selection.entitySelector.$invoice)}
						layout={EntityLayout.Value}
						open={false}
					/>
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
							settledAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const settledAtMs = entity.settledAtMs}
					{#if settledAtMs != null}
						<div>
							<dt>Settled</dt>
							<dd>
								{settledAtMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							settleIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const settleIndex = entity.settleIndex}
					{#if settleIndex != null}
						<div>
							<dt>Settle index</dt>
							<dd>
								{settleIndex}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
