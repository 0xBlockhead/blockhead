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
	}: EntitySelectionViewProps<EntityType.BlockheadAlgorandParticipationKey> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadAlgorandParticipationKey = $derived(viewSelection({
		fields: {
			firstValidRound: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.participationId || 'blockhead algorand participation key')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AlgorandAccountView from '$/views/AlgorandAccountView.svelte'
	import AlgorandNetworkView from '$/views/AlgorandNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAlgorandParticipationKey}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{selection.entitySelector.participationId || 'blockhead algorand participation key'}
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.nodeId || selection.entitySelector.participationId || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadAlgorandParticipationKey}>
			{#snippet children(entity)}
				{@const firstValidRound = entity.firstValidRound}
				{#if firstValidRound != null}
					<span data-text="muted">
						<NumberValue
							value={firstValidRound}
						/>
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
					{selection.entitySelector.nodeId}
				</dd>
			</div>

			<div>
				<dt>participation ID</dt>
				<dd>
					{selection.entitySelector.participationId}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$account}
			>
				{#snippet children(algorandAccount)}
					{#if algorandAccount != null}
						<div>
							<dt>account</dt>
							<dd>
								<AlgorandAccountView
									selection={select(EntityType.AlgorandAccount, algorandAccount[EntityMetaKey.Selector])}
									prefetched={algorandAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={blockheadAlgorandParticipationKey}
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
							keyDilution: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const keyDilution = entity.keyDilution}
					{#if keyDilution != null}
						<div>
							<dt>key dilution</dt>
							<dd>
								<NumberValue
									value={keyDilution}
								/>
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
							selectionKey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const selectionKey = entity.selectionKey}
					{#if selectionKey != null}
						<div>
							<dt>selection key</dt>
							<dd>
								{selectionKey}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							votingKey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const votingKey = entity.votingKey}
					{#if votingKey != null}
						<div>
							<dt>voting key</dt>
							<dd>
								{votingKey}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							stateProofKey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const stateProofKey = entity.stateProofKey}
					{#if stateProofKey != null}
						<div>
							<dt>state proof key</dt>
							<dd>
								{stateProofKey}
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
							effectiveFirstRound: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const effectiveFirstRound = entity.effectiveFirstRound}
					{#if effectiveFirstRound != null}
						<div>
							<dt>effective first round</dt>
							<dd>
								<NumberValue
									value={effectiveFirstRound}
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
							effectiveLastRound: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const effectiveLastRound = entity.effectiveLastRound}
					{#if effectiveLastRound != null}
						<div>
							<dt>effective last round</dt>
							<dd>
								<NumberValue
									value={effectiveLastRound}
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
							lastSyncedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastSyncedAt = entity.lastSyncedAt}
					{#if lastSyncedAt != null}
						<div>
							<dt>last synced AT</dt>
							<dd>
								<Timestamp timestamp={lastSyncedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
