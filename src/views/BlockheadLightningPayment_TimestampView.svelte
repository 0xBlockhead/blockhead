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
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadLightningPayment_Timestamp>, 'prefetched'> = $props()

	const payment = $derived(selection.entitySelector.$payment)


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadLightningPaymentView from '$/views/BlockheadLightningPaymentView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLightningPayment_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/payments/[paymentHash=stringSegment]/(blockheadLightningPayment)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in payment.$network ?
							caip2StringFromValue(payment.$network.caip2)
						:
							payment.$network.slug
					),
					paymentHash: payment.paymentHash,
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
						status: true,
						feeMsat: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{[(entity.status ?? ''), String(entity.feeMsat ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Payment</dt>
				<dd>
					<BlockheadLightningPaymentView
						selection={select(EntityType.BlockheadLightningPayment, selection.entitySelector.$payment)}
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
							failureReason: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const failureReason = entity.failureReason}
					{#if failureReason != null}
						<div>
							<dt>Failure reason</dt>
							<dd>
								{failureReason}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							preimage: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const preimage = entity.preimage}
					{#if preimage != null}
						<div>
							<dt>Preimage</dt>
							<dd>
								{preimage}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
