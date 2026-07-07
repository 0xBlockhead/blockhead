<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.OracleFeed_Round>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.OracleFeed_Round>>
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
	const oracleFeedRound = $derived(selection({
		fields: {
			answer: true,
			updatedAtMs: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.roundId ?? prefetched.roundId) ?? '')].filter(Boolean).join(' ') || 'oracle feed round')
	const viewDomId = $derived('oracle-feed-round-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import OracleFeedView from '$/views/OracleFeedView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.OracleFeed_Round}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={oracleFeedRound}>
			{#snippet Pending()}
				{@const roundId0 = selection.entitySelector.roundId ?? prefetched.roundId}
				{#if roundId0 !== undefined && roundId0 !== null}
					<NumberValue value={Number(roundId0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const roundId0 = resolvedEntity.roundId}
				{#if roundId0 !== undefined && roundId0 !== null}
					<NumberValue value={Number(roundId0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={oracleFeedRound}>
			{#snippet Pending()}
				{@const answer0 = prefetched.answer}
				{#if answer0 !== undefined && answer0 !== null}
					<NumberValue value={Number(answer0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const answer0 = resolvedEntity.answer}
				{#if answer0 !== undefined && answer0 !== null}
					<NumberValue value={Number(answer0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={oracleFeedRound}>
			{#snippet Pending()}
				{@const updatedAtMs0 = prefetched.updatedAtMs}
				{#if updatedAtMs0 !== undefined && updatedAtMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(updatedAtMs0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const updatedAtMs0 = resolvedEntity.updatedAtMs}
				{#if updatedAtMs0 !== undefined && updatedAtMs0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(updatedAtMs0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>oracle feed</dt>
				<dd>
					<OracleFeedView
						selection={select(EntityType.OracleFeed, selection.entitySelector.$oracleFeed, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>parent oracle feed</dt>
				<dd>
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.OracleFeed, false>('$parentOracleFeed')}
					>
						{#snippet children(oracleFeed)}
							{#if oracleFeed[EntityMetaKey.Selector] != null}
								<OracleFeedView
									selection={select(EntityType.OracleFeed, oracleFeed[EntityMetaKey.Selector])}
									prefetched={oracleFeed}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>round ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									roundId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const roundId = selection.entitySelector.roundId ?? prefetched.roundId}
							{#if roundId !== undefined && roundId !== null}
								<NumberValue value={Number(roundId)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const roundId = resolvedEntity.roundId}
							{#if roundId !== undefined && roundId !== null}
								<NumberValue value={Number(roundId)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							answer: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const answer = prefetched.answer}
					{#if answer !== undefined && answer !== null}
						<div>
							<dt>answer</dt>
							<dd>
								<NumberValue value={Number(answer)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const answer = resolvedEntity.answer}
					{#if answer !== undefined && answer !== null}
						<div>
							<dt>answer</dt>
							<dd>
								<NumberValue value={Number(answer)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							startedAtMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const startedAtMs = prefetched.startedAtMs}
					{#if startedAtMs !== undefined && startedAtMs !== null}
						<div>
							<dt>started AT ms</dt>
							<dd>
								<Timestamp timestamp={Number(startedAtMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const startedAtMs = resolvedEntity.startedAtMs}
					{#if startedAtMs !== undefined && startedAtMs !== null}
						<div>
							<dt>started AT ms</dt>
							<dd>
								<Timestamp timestamp={Number(startedAtMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							updatedAtMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const updatedAtMs = prefetched.updatedAtMs}
					{#if updatedAtMs !== undefined && updatedAtMs !== null}
						<div>
							<dt>updated AT ms</dt>
							<dd>
								<Timestamp timestamp={Number(updatedAtMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const updatedAtMs = resolvedEntity.updatedAtMs}
					{#if updatedAtMs !== undefined && updatedAtMs !== null}
						<div>
							<dt>updated AT ms</dt>
							<dd>
								<Timestamp timestamp={Number(updatedAtMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							answeredInRound: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const answeredInRound = prefetched.answeredInRound}
					{#if answeredInRound !== undefined && answeredInRound !== null}
						<div>
							<dt>answered in round</dt>
							<dd>
								<NumberValue value={Number(answeredInRound)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const answeredInRound = resolvedEntity.answeredInRound}
					{#if answeredInRound !== undefined && answeredInRound !== null}
						<div>
							<dt>answered in round</dt>
							<dd>
								<NumberValue value={Number(answeredInRound)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmNetwork, false>('$network')}
			>
				{#snippet children(evmNetwork)}
					{#if evmNetwork != null && evmNetwork[EntityMetaKey.Selector] != null}
						<div>
							<dt>network</dt>
							<dd>
								<EvmNetworkView
									selection={select(EntityType.EvmNetwork, evmNetwork[EntityMetaKey.Selector])}
									prefetched={evmNetwork}
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
							blockNumber: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blockNumber = prefetched.blockNumber}
					{#if blockNumber !== undefined && blockNumber !== null}
						<div>
							<dt>Block number</dt>
							<dd>
								<NumberValue value={Number(blockNumber)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockNumber = resolvedEntity.blockNumber}
					{#if blockNumber !== undefined && blockNumber !== null}
						<div>
							<dt>Block number</dt>
							<dd>
								<NumberValue value={Number(blockNumber)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transactionHash = prefetched.transactionHash}
					{#if transactionHash !== undefined && transactionHash !== null}
						<div>
							<dt>transaction hash</dt>
							<dd>
								<TruncatedValue value={String((transactionHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionHash = resolvedEntity.transactionHash}
					{#if transactionHash !== undefined && transactionHash !== null}
						<div>
							<dt>transaction hash</dt>
							<dd>
								<TruncatedValue value={String((transactionHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							logIndex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const logIndex = prefetched.logIndex}
					{#if logIndex !== undefined && logIndex !== null}
						<div>
							<dt>log index</dt>
							<dd>
								<NumberValue value={Number(logIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const logIndex = resolvedEntity.logIndex}
					{#if logIndex !== undefined && logIndex !== null}
						<div>
							<dt>log index</dt>
							<dd>
								<NumberValue value={Number(logIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
