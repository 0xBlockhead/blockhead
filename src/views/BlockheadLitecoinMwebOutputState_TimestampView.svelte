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
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadLitecoinMwebOutputState_Timestamp>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadLitecoinMwebOutputStateTimestamp = $derived(viewSelection({
		fields: {
			spent: true,
			confirmations: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadLitecoinMwebOutputStateView from '$/views/BlockheadLitecoinMwebOutputStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLitecoinMwebOutputState_Timestamp}
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
		<ResourceBoundary resource={blockheadLitecoinMwebOutputStateTimestamp}>
			{#snippet children(entity)}
				{String(entity.spent ?? '') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadLitecoinMwebOutputStateTimestamp}>
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

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>output state</dt>
				<dd>
					<BlockheadLitecoinMwebOutputStateView
						selection={select(EntityType.BlockheadLitecoinMwebOutputState, selection.entitySelector.$outputState)}
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
				resource={blockheadLitecoinMwebOutputStateTimestamp}
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
							receivedAtHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const receivedAtHeight = entity.receivedAtHeight}
					{#if receivedAtHeight != null}
						<div>
							<dt>received AT height</dt>
							<dd>
								<NumberValue
									value={receivedAtHeight}
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
				resource={blockheadLitecoinMwebOutputStateTimestamp}
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
