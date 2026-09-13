<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.StarknetTransaction_Timestamp>, 'prefetched'> = $props()

	const transaction = $derived(selection.entitySelector.$transaction)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Juno_JsonRpc,
			Source.Pathfinder,
			Source.Starkscan,
			Source.Voyager,
		],
	}))
	const starknetTransactionTimestamp = $derived(viewSelection({
		fields: {
			executionStatus: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import StarknetTransactionView from '$/views/StarknetTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.StarknetTransaction_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'starknet transaction timestamp'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/transaction/starknet/[transactionHash=stringSegment]/(starknetTransaction)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						transaction.$network.$network.caip2 !== undefined ?
							caip2StringFromValue(transaction.$network.$network.caip2)
						:
							transaction.$network.$network.slug
					),
					transactionHash: transaction.transactionHash,
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
		<StarknetTransactionView
			selection={select(EntityType.StarknetTransaction, selection.entitySelector.$transaction)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={starknetTransactionTimestamp}>
			{#snippet children(entity)}
				{@const executionStatus = entity.executionStatus}
				{#if executionStatus != null}
					<span data-text="muted">
						{executionStatus}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<StarknetTransactionView
						selection={select(EntityType.StarknetTransaction, selection.entitySelector.$transaction)}
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
				resource={
					viewSelection({
						fields: {
							blockNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockNumber = entity.blockNumber}
					{#if blockNumber != null}
						<div>
							<dt>Block number</dt>
							<dd>
								<NumberValue
									value={blockNumber}
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
							finalityStatus: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const finalityStatus = entity.finalityStatus}
					{#if finalityStatus != null}
						<div>
							<dt>finality status</dt>
							<dd>
								{finalityStatus}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={starknetTransactionTimestamp}
			>
				{#snippet children(entity)}
					{@const executionStatus = entity.executionStatus}
					{#if executionStatus != null}
						<div>
							<dt>execution status</dt>
							<dd>
								{executionStatus}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							actualFee: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const actualFee = entity.actualFee}
					{#if actualFee != null}
						<div>
							<dt>actual fee</dt>
							<dd>
								<NumberValue
									value={actualFee}
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
							revertReason: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const revertReason = entity.revertReason}
					{#if revertReason != null}
						<div>
							<dt>revert reason</dt>
							<dd>
								{revertReason}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>messages sent</dt>
				<dd>
					<ResourceBoundary
						resource={viewSelection.messagesSent}
					>
						{#snippet children(messagesSent)}
							{messagesSent.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							eventsCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const eventsCount = entity.eventsCount}
					{#if eventsCount != null}
						<div>
							<dt>events count</dt>
							<dd>
								<NumberValue
									value={eventsCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
