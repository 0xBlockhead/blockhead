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
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadLightningInvoice_Timestamp>, 'prefetched'> = $props()

	const invoice = $derived(selection.entitySelector.$invoice)


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
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/invoices/[paymentHash=stringSegment]/(blockheadLightningInvoice)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						invoice.$network.caip2 !== undefined ?
							caip2StringFromValue(invoice.$network.caip2)
						:
							invoice.$network.slug
					),
					paymentHash: invoice.paymentHash,
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
		<ResourceBoundary
			resource={
				selection({
					fields: {
						state: true,
						amountPaidMsat: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{[(entity.state ?? ''), String(entity.amountPaidMsat ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Invoice</dt>
				<dd>
					<BlockheadLightningInvoiceView
						selection={select(EntityType.BlockheadLightningInvoice, selection.entitySelector.$invoice)}
						layout={EntityLayout.Value}
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
