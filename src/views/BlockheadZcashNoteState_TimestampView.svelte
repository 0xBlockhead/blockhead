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
	}: EntitySelectionViewProps<EntityType.BlockheadZcashNoteState_Timestamp> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
			Source.ZcashClientBackend_Local,
			Source.ZcashLightwalletd_Grpc,
			Source.ZcashdWallet_JsonRpc,
		],
	}))
	const blockheadZcashNoteStateTimestamp = $derived(viewSelection({
		fields: {
			spent: true,
			confirmations: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadZcashNoteStateView from '$/views/BlockheadZcashNoteStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadZcashNoteState_Timestamp}
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
		<ResourceBoundary resource={blockheadZcashNoteStateTimestamp}>
			{#snippet children(entity)}
				{String(entity.spent ?? '') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadZcashNoteStateTimestamp}>
			{#snippet children(entity)}
				{@const confirmations = entity.confirmations}
				{#if confirmations != null}
					<span data-text="muted">
						<NumberValue
							value={confirmations}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>note state</dt>
				<dd>
					<BlockheadZcashNoteStateView
						selection={select(EntityType.BlockheadZcashNoteState, selection.entitySelector.$noteState)}
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
				resource={blockheadZcashNoteStateTimestamp}
			>
				{#snippet children(entity)}
					{@const spent = entity.spent}
					{#if spent != null}
						<div>
							<dt>spent</dt>
							<dd>
								{spent ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							spendTransactionId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const spendTransactionId = entity.spendTransactionId}
					{#if spendTransactionId != null}
						<div>
							<dt>spend transaction ID</dt>
							<dd>
								{spendTransactionId}
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
							spentAtHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const spentAtHeight = entity.spentAtHeight}
					{#if spentAtHeight != null}
						<div>
							<dt>spent AT height</dt>
							<dd>
								<NumberValue
									value={spentAtHeight}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadZcashNoteStateTimestamp}
			>
				{#snippet children(entity)}
					{@const confirmations = entity.confirmations}
					{#if confirmations != null}
						<div>
							<dt>confirmations</dt>
							<dd>
								<NumberValue
									value={confirmations}
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
							witnessAvailable: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const witnessAvailable = entity.witnessAvailable}
					{#if witnessAvailable != null}
						<div>
							<dt>witness available</dt>
							<dd>
								{witnessAvailable ? 'Yes' : 'No'}
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
							lastScannedHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastScannedHeight = entity.lastScannedHeight}
					{#if lastScannedHeight != null}
						<div>
							<dt>last scanned height</dt>
							<dd>
								<NumberValue
									value={lastScannedHeight}
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
							lastScannedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastScannedAt = entity.lastScannedAt}
					{#if lastScannedAt != null}
						<div>
							<dt>last scanned AT</dt>
							<dd>
								<Timestamp timestamp={lastScannedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
