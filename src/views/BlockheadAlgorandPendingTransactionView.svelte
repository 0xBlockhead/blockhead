<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadAlgorandPendingTransaction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadAlgorandPendingTransaction>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const blockheadAlgorandPendingTransaction = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			transactionType: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.txId ?? prefetched.txId) ?? '')].filter(Boolean).join(' ') || 'blockhead algorand pending transaction')
	const viewDomId = $derived('blockhead-algorand-pending-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import AlgorandNetworkView from '$/views/AlgorandNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAlgorandPendingTransaction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadAlgorandPendingTransaction}>
			{#snippet Pending()}
				{[String((selection.entitySelector.txId ?? prefetched.txId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead algorand pending transaction'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.txId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadAlgorandPendingTransaction}>
			{#snippet Pending()}
				{[String((prefetched.transactionType) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.txId ?? prefetched.txId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead algorand pending transaction'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.transactionType) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.txId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadAlgorandPendingTransaction}>
			{#snippet Pending()}
				{@const observedAtMs0 = selection.entitySelector.observedAtMs ?? prefetched.observedAtMs}
				{#if observedAtMs0 !== undefined && observedAtMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(observedAtMs0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const observedAtMs0 = resolvedEntity.observedAtMs}
				{#if observedAtMs0 !== undefined && observedAtMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(observedAtMs0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>node ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									nodeId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const nodeId = selection.entitySelector.nodeId ?? prefetched.nodeId}
							{#if nodeId !== undefined && nodeId !== null}
								{String((nodeId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const nodeId = resolvedEntity.nodeId}
							{#if nodeId !== undefined && nodeId !== null}
								{String((nodeId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>transaction ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									txId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const txId = selection.entitySelector.txId ?? prefetched.txId}
							{#if txId !== undefined && txId !== null}
								{String((txId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const txId = resolvedEntity.txId}
							{#if txId !== undefined && txId !== null}
								{String((txId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>observed AT ms</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									observedAtMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const observedAtMs = selection.entitySelector.observedAtMs ?? prefetched.observedAtMs}
							{#if observedAtMs !== undefined && observedAtMs !== null}
								<Timestamp timestamp={Number(observedAtMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const observedAtMs = resolvedEntity.observedAtMs}
							{#if observedAtMs !== undefined && observedAtMs !== null}
								<Timestamp timestamp={Number(observedAtMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$network}
			>
				{#snippet children(algorandNetwork)}
					{#if algorandNetwork != null && algorandNetwork[EntityMetaKey.Selector] != null}
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
					selection({
						fields: {
							sender: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sender = prefetched.sender}
					{#if sender !== undefined && sender !== null}
						<div>
							<dt>sender</dt>
							<dd>
								{String((sender) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sender = resolvedEntity.sender}
					{#if sender !== undefined && sender !== null}
						<div>
							<dt>sender</dt>
							<dd>
								{String((sender) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transactionType = prefetched.transactionType}
					{#if transactionType !== undefined && transactionType !== null}
						<div>
							<dt>transaction type</dt>
							<dd>
								{String((transactionType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionType = resolvedEntity.transactionType}
					{#if transactionType !== undefined && transactionType !== null}
						<div>
							<dt>transaction type</dt>
							<dd>
								{String((transactionType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							fee: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const fee = prefetched.fee}
					{#if fee !== undefined && fee !== null}
						<div>
							<dt>fee</dt>
							<dd>
								<NumberValue value={Number(fee)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fee = resolvedEntity.fee}
					{#if fee !== undefined && fee !== null}
						<div>
							<dt>fee</dt>
							<dd>
								<NumberValue value={Number(fee)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							firstValidRound: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const firstValidRound = prefetched.firstValidRound}
					{#if firstValidRound !== undefined && firstValidRound !== null}
						<div>
							<dt>first valid round</dt>
							<dd>
								<NumberValue value={Number(firstValidRound)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const firstValidRound = resolvedEntity.firstValidRound}
					{#if firstValidRound !== undefined && firstValidRound !== null}
						<div>
							<dt>first valid round</dt>
							<dd>
								<NumberValue value={Number(firstValidRound)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastValidRound: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lastValidRound = prefetched.lastValidRound}
					{#if lastValidRound !== undefined && lastValidRound !== null}
						<div>
							<dt>last valid round</dt>
							<dd>
								<NumberValue value={Number(lastValidRound)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastValidRound = resolvedEntity.lastValidRound}
					{#if lastValidRound !== undefined && lastValidRound !== null}
						<div>
							<dt>last valid round</dt>
							<dd>
								<NumberValue value={Number(lastValidRound)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							group: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const group = prefetched.group}
					{#if group !== undefined && group !== null}
						<div>
							<dt>group</dt>
							<dd>
								{String((group) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const group = resolvedEntity.group}
					{#if group !== undefined && group !== null}
						<div>
							<dt>group</dt>
							<dd>
								{String((group) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							poolPriority: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const poolPriority = prefetched.poolPriority}
					{#if poolPriority !== undefined && poolPriority !== null}
						<div>
							<dt>pool priority</dt>
							<dd>
								<NumberValue value={Number(poolPriority)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const poolPriority = resolvedEntity.poolPriority}
					{#if poolPriority !== undefined && poolPriority !== null}
						<div>
							<dt>pool priority</dt>
							<dd>
								<NumberValue value={Number(poolPriority)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
