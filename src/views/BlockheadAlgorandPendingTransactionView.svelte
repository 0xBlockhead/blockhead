<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: EntitySelectionViewProps<EntityType.BlockheadAlgorandPendingTransaction> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadAlgorandPendingTransaction = $derived(viewSelection({
		fields: {
			transactionType: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.txId ?? '') || 'blockhead algorand pending transaction')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import AlgorandNetworkView from '$/views/AlgorandNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAlgorandPendingTransaction}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.txId ?? '') || 'blockhead algorand pending transaction'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadAlgorandPendingTransaction}>
			{#snippet children(entity)}
				{(entity.transactionType ?? '') || pendingEntity.txId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<Timestamp timestamp={Number(pendingEntity.observedAtMs)} />
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>node ID</dt>
				<dd>
					{pendingEntity.nodeId}
				</dd>
			</div>

			<div>
				<dt>transaction ID</dt>
				<dd>
					{pendingEntity.txId}
				</dd>
			</div>

			<div>
				<dt>observed AT ms</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.observedAtMs)} />
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$network}
			>
				{#snippet children(algorandNetwork)}
					{#if algorandNetwork != null}
						<div>
							<dt>network</dt>
							<dd>
								<AlgorandNetworkView
									selection={select(EntityType.AlgorandNetwork, algorandNetwork[EntityMetaKey.Selector])}
									prefetched={algorandNetwork}
									layout={EntityLayout.Value}
									open={false}
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
							sender: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sender = entity.sender}
					{#if sender != null}
						<div>
							<dt>sender</dt>
							<dd>
								{sender}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadAlgorandPendingTransaction}
			>
				{#snippet children(entity)}
					{@const transactionType = entity.transactionType}
					{#if transactionType != null}
						<div>
							<dt>transaction type</dt>
							<dd>
								{transactionType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							fee: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fee = entity.fee}
					{#if fee != null}
						<div>
							<dt>fee</dt>
							<dd>
								<NumberValue
									value={fee}
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
							firstValidRound: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const firstValidRound = entity.firstValidRound}
					{#if firstValidRound != null}
						<div>
							<dt>first valid round</dt>
							<dd>
								<NumberValue
									value={firstValidRound}
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
							lastValidRound: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastValidRound = entity.lastValidRound}
					{#if lastValidRound != null}
						<div>
							<dt>last valid round</dt>
							<dd>
								<NumberValue
									value={lastValidRound}
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
							group: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const group = entity.group}
					{#if group != null}
						<div>
							<dt>group</dt>
							<dd>
								{group}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							poolPriority: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const poolPriority = entity.poolPriority}
					{#if poolPriority != null}
						<div>
							<dt>pool priority</dt>
							<dd>
								<NumberValue
									value={poolPriority}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
