<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadMoneroSubaddressState_Timestamp>, 'prefetched'> = $props()

	const subaddressState = $derived(selection.entitySelector.$subaddressState)
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


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadMoneroSubaddressStateView from '$/views/BlockheadMoneroSubaddressStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadMoneroSubaddressState_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/~/monero/wallet/[walletId=stringSegment]/subaddress-state/[accountIndex=nonNegativeInteger]/[addressIndex=nonNegativeInteger]/(blockheadMoneroSubaddressState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					walletId: subaddressState.walletId,
					accountIndex: String(subaddressState.accountIndex),
					addressIndex: String(subaddressState.addressIndex),
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
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadMoneroSubaddressStateTimestamp}>
			{#snippet children(entity)}
				{@const balanceAtomicUnits = entity.balanceAtomicUnits}
				{#if balanceAtomicUnits != null}
					<NumberValue
						value={balanceAtomicUnits}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadMoneroSubaddressStateTimestamp}>
			{#snippet children(entity)}
				{@const used = entity.used}
				{#if used != null}
					<span data-text="muted">
						{used ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>subaddress state</dt>
				<dd>
					<BlockheadMoneroSubaddressStateView
						selection={select(EntityType.BlockheadMoneroSubaddressState, selection.entitySelector.$subaddressState)}
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
								<Timestamp timestamp={lastSyncedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
