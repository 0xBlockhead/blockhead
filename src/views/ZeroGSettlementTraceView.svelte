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
	}: EntitySelectionViewProps<EntityType.ZeroGSettlementTrace> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.ZeroGChain_JsonRpc,
			Source.ZeroGStorageNode_JsonRpc,
			Source.ZeroGStorageScan_Rest,
		],
	}))
	const zeroGSettlementTrace = $derived(viewSelection({
		fields: {
			settlementTransactionHash: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.traceId ?? '') || 'zero g settlement trace')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ZeroGServiceRequestView from '$/views/ZeroGServiceRequestView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGSettlementTrace}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.traceId ?? '') || 'zero g settlement trace'}
	{/snippet}

	{#snippet Value()}
		<ZeroGServiceRequestView
			selection={select(EntityType.ZeroGServiceRequest, selection.entitySelector.$serviceRequest)}
			href=""
			layout={EntityLayout.Value}
			open={false}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={zeroGSettlementTrace}>
			{#snippet children(entity)}
				{@const settlementTransactionHash0 = entity.settlementTransactionHash}
				{#if settlementTransactionHash0 != null}
					<span data-text="muted">
						<TruncatedValue value={settlementTransactionHash0} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>service request</dt>
				<dd>
					<ZeroGServiceRequestView
						selection={select(EntityType.ZeroGServiceRequest, selection.entitySelector.$serviceRequest)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>trace ID</dt>
				<dd>
					{pendingEntity.traceId}
				</dd>
			</div>

			<ResourceBoundary
				resource={zeroGSettlementTrace}
			>
				{#snippet children(entity)}
					{@const settlementTransactionHash = entity.settlementTransactionHash}
					{#if settlementTransactionHash != null}
						<div>
							<dt>settlement transaction hash</dt>
							<dd>
								<TruncatedValue value={settlementTransactionHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							acknowledgementSignature: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const acknowledgementSignature = entity.acknowledgementSignature}
					{#if acknowledgementSignature != null}
						<div>
							<dt>acknowledgement signature</dt>
							<dd>
								<TruncatedValue value={acknowledgementSignature} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							rewardAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rewardAmount = entity.rewardAmount}
					{#if rewardAmount != null}
						<div>
							<dt>reward amount</dt>
							<dd>
								<NumberValue
									value={rewardAmount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
