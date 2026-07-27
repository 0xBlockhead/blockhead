<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: EntitySelectionViewProps<EntityType.OracleFeed_Round> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const oracleFeedRound = $derived(selection({
		fields: {
			answer: true,
			updatedAtMs: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.roundId ?? '') || 'oracle feed round')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import OracleFeedView from '$/views/OracleFeedView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.OracleFeed_Round}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={pendingEntity.roundId}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={oracleFeedRound}>
			{#snippet children(entity)}
				{@const answer0 = entity.answer}
				{#if answer0 != null}
					<NumberValue
						value={answer0}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={oracleFeedRound}>
			{#snippet children(entity)}
				{@const updatedAtMs0 = entity.updatedAtMs}
				{#if updatedAtMs0 != null}
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
						selection={select(EntityType.OracleFeed, selection.entitySelector.$oracleFeed)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>parent oracle feed</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$parentOracleFeed}
					>
						{#snippet children(oracleFeed)}
							<OracleFeedView
								selection={select(EntityType.OracleFeed, oracleFeed[EntityMetaKey.Selector])}
								prefetched={oracleFeed}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>round ID</dt>
				<dd>
					<NumberValue
						value={pendingEntity.roundId}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={oracleFeedRound}
			>
				{#snippet children(entity)}
					{@const answer = entity.answer}
					{#if answer != null}
						<div>
							<dt>answer</dt>
							<dd>
								<NumberValue
									value={answer}
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
							startedAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const startedAtMs = entity.startedAtMs}
					{#if startedAtMs != null}
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
				resource={oracleFeedRound}
			>
				{#snippet children(entity)}
					{@const updatedAtMs = entity.updatedAtMs}
					{#if updatedAtMs != null}
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
				{#snippet children(entity)}
					{@const answeredInRound = entity.answeredInRound}
					{#if answeredInRound != null}
						<div>
							<dt>answered in round</dt>
							<dd>
								<NumberValue
									value={answeredInRound}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$network}
			>
				{#snippet children(network)}
					{#if network != null}
						<div>
							<dt>network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
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
					selection({
						fields: {
							transactionHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionHash = entity.transactionHash}
					{#if transactionHash != null}
						<div>
							<dt>transaction hash</dt>
							<dd>
								<TruncatedValue value={transactionHash} />
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
				{#snippet children(entity)}
					{@const logIndex = entity.logIndex}
					{#if logIndex != null}
						<div>
							<dt>log index</dt>
							<dd>
								<NumberValue
									value={logIndex}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
