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
	}: EntitySelectionViewProps<EntityType.BlockheadMoneroSubaddressState_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadMoneroSubaddressStateTimestamp = $derived(viewSelection({
		fields: {
			balanceAtomicUnits: true,
			used: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.timestampMs ?? '') || 'blockhead monero subaddress state timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadMoneroSubaddressStateView from '$/views/BlockheadMoneroSubaddressStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadMoneroSubaddressState_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadMoneroSubaddressStateTimestamp}>
			{#snippet children(entity)}
				{@const balanceAtomicUnits0 = entity.balanceAtomicUnits}
				{#if balanceAtomicUnits0 != null}
					<NumberValue
						value={balanceAtomicUnits0}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadMoneroSubaddressStateTimestamp}>
			{#snippet children(entity)}
				{@const used0 = entity.used}
				{#if used0 != null}
					<span data-text="muted">
						{used0 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>subaddress state</dt>
				<dd>
					<BlockheadMoneroSubaddressStateView
						selection={select(EntityType.BlockheadMoneroSubaddressState, selection.entitySelector.$subaddressState)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadMoneroSubaddressStateTimestamp}
			>
				{#snippet children(entity)}
					{@const used = entity.used}
					{#if used != null}
						<div>
							<dt>used</dt>
							<dd>
								{used ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={blockheadMoneroSubaddressStateTimestamp}
			>
				{#snippet children(entity)}
					{@const balanceAtomicUnits = entity.balanceAtomicUnits}
					{#if balanceAtomicUnits != null}
						<div>
							<dt>balance atomic units</dt>
							<dd>
								<NumberValue
									value={balanceAtomicUnits}
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
							unlockedBalanceAtomicUnits: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const unlockedBalanceAtomicUnits = entity.unlockedBalanceAtomicUnits}
					{#if unlockedBalanceAtomicUnits != null}
						<div>
							<dt>unlocked balance atomic units</dt>
							<dd>
								<NumberValue
									value={unlockedBalanceAtomicUnits}
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
							numUnspentOutputs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const numUnspentOutputs = entity.numUnspentOutputs}
					{#if numUnspentOutputs != null}
						<div>
							<dt>num unspent outputs</dt>
							<dd>
								<NumberValue
									value={numUnspentOutputs}
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
							blocksToUnlock: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blocksToUnlock = entity.blocksToUnlock}
					{#if blocksToUnlock != null}
						<div>
							<dt>blocks to unlock</dt>
							<dd>
								<NumberValue
									value={blocksToUnlock}
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
							timeToUnlockSeconds: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const timeToUnlockSeconds = entity.timeToUnlockSeconds}
					{#if timeToUnlockSeconds != null}
						<div>
							<dt>time to unlock seconds</dt>
							<dd>
								<NumberValue
									value={timeToUnlockSeconds}
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
								<Timestamp timestamp={Number(lastSyncedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
