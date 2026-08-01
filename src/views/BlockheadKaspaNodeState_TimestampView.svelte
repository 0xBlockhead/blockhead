<!-- Generated from APP.ts. -->

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
	}: EntitySelectionViewProps<EntityType.BlockheadKaspaNodeState_Timestamp> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadKaspaNodeStateTimestamp = $derived(viewSelection({
		fields: {
			isSynced: true,
			hasUtxoIndex: true,
			peerCount: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadKaspaNodeStateView from '$/views/BlockheadKaspaNodeStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadKaspaNodeState_Timestamp}
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
		<ResourceBoundary resource={blockheadKaspaNodeStateTimestamp}>
			{#snippet children(entity)}
				{[String(entity.isSynced ?? ''), String(entity.hasUtxoIndex ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadKaspaNodeStateTimestamp}>
			{#snippet children(entity)}
				{@const peerCount = entity.peerCount}
				{#if peerCount != null}
					<span data-text="muted">
						<NumberValue
							value={peerCount}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>node state</dt>
				<dd>
					<BlockheadKaspaNodeStateView
						selection={select(EntityType.BlockheadKaspaNodeState, selection.entitySelector.$nodeState)}
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
							serverVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const serverVersion = entity.serverVersion}
					{#if serverVersion != null}
						<div>
							<dt>server version</dt>
							<dd>
								{serverVersion}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={blockheadKaspaNodeStateTimestamp}
			>
				{#snippet children(entity)}
					{@const isSynced = entity.isSynced}
					{#if isSynced != null}
						<div>
							<dt>is synced</dt>
							<dd>
								{isSynced ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadKaspaNodeStateTimestamp}
			>
				{#snippet children(entity)}
					{@const hasUtxoIndex = entity.hasUtxoIndex}
					{#if hasUtxoIndex != null}
						<div>
							<dt>has UTXO index</dt>
							<dd>
								{hasUtxoIndex ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadKaspaNodeStateTimestamp}
			>
				{#snippet children(entity)}
					{@const peerCount = entity.peerCount}
					{#if peerCount != null}
						<div>
							<dt>peer count</dt>
							<dd>
								<NumberValue
									value={peerCount}
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

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							virtualDaaScore: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const virtualDaaScore = entity.virtualDaaScore}
					{#if virtualDaaScore != null}
						<div>
							<dt>virtual daa score</dt>
							<dd>
								<NumberValue
									value={virtualDaaScore}
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
							virtualSelectedParentHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const virtualSelectedParentHash = entity.virtualSelectedParentHash}
					{#if virtualSelectedParentHash != null}
						<div>
							<dt>virtual selected parent hash</dt>
							<dd>
								<TruncatedValue value={virtualSelectedParentHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							pruningPointHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pruningPointHash = entity.pruningPointHash}
					{#if pruningPointHash != null}
						<div>
							<dt>pruning point hash</dt>
							<dd>
								<TruncatedValue value={pruningPointHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
