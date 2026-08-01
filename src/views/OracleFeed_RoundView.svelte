<!-- Generated from APP.ts. -->

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
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.OracleFeed_Round>, 'prefetched'> = $props()

	const oracleFeedRound = $derived(selection({
		fields: {
			answer: true,
			updatedAtMs: true,
		},
	}))


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
	title={title ?? String(selection.entitySelector.roundId)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={selection.entitySelector.roundId}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={oracleFeedRound}>
			{#snippet children(entity)}
				{@const answer = entity.answer}
				{#if answer != null}
					<NumberValue
						value={answer}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={oracleFeedRound}>
			{#snippet children(entity)}
				{@const updatedAtMs = entity.updatedAtMs}
				{#if updatedAtMs != null}
					<span data-text="muted">
						<Timestamp timestamp={updatedAtMs} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>oracle feed</dt>
				<dd>
					<OracleFeedView
						selection={select(EntityType.OracleFeed, selection.entitySelector.$oracleFeed)}
						layout={EntityLayout.Value}
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
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>round ID</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.roundId}
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
								<Timestamp timestamp={startedAtMs} />
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
								<Timestamp timestamp={updatedAtMs} />
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
