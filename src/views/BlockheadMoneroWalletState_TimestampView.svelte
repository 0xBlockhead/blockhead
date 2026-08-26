<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadMoneroWalletState_Timestamp>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadMoneroWalletStateTimestamp = $derived(viewSelection({
		fields: {
			balanceAtomicUnits: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadMoneroWalletStateView from '$/views/BlockheadMoneroWalletStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadMoneroWalletState_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/~/monero/wallet/[walletId=stringSegment]/state/(blockheadMoneroWalletState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					walletId: selection.entitySelector.$walletState.walletId,
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
		<ResourceBoundary resource={blockheadMoneroWalletStateTimestamp}>
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
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>wallet state</dt>
				<dd>
					<BlockheadMoneroWalletStateView
						selection={select(EntityType.BlockheadMoneroWalletState, selection.entitySelector.$walletState)}
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
							height: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const height = entity.height}
					{#if height != null}
						<div>
							<dt>Height</dt>
							<dd>
								<NumberValue
									value={height}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={blockheadMoneroWalletStateTimestamp}
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
							multisigImportNeeded: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const multisigImportNeeded = entity.multisigImportNeeded}
					{#if multisigImportNeeded != null}
						<div>
							<dt>multisig import needed</dt>
							<dd>
								{multisigImportNeeded ? 'Yes' : 'No'}
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
							outputsExportedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const outputsExportedAt = entity.outputsExportedAt}
					{#if outputsExportedAt != null}
						<div>
							<dt>outputs exported AT</dt>
							<dd>
								<Timestamp timestamp={outputsExportedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							keyImagesExportedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const keyImagesExportedAt = entity.keyImagesExportedAt}
					{#if keyImagesExportedAt != null}
						<div>
							<dt>key images exported AT</dt>
							<dd>
								<Timestamp timestamp={keyImagesExportedAt} />
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
