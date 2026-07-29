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
	}: EntitySelectionViewProps<EntityType.BlockheadLightningPayment_Timestamp> = $props()

	const blockheadLightningPaymentTimestamp = $derived(selection({
		fields: {
			status: true,
			feeMsat: true,
		},
	}))


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
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadLightningPaymentTimestamp}>
			{#snippet children(entity)}
				{[(entity.status ?? ''), String(entity.feeMsat ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Payment</dt>
				<dd>
					<BlockheadLightningPaymentView
						selection={select(EntityType.BlockheadLightningPayment, selection.entitySelector.$payment)}
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
