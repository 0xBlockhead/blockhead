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
	}: EntitySelectionViewProps<EntityType.BlockheadMoneroTransferState_Timestamp> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadMoneroTransferStateTimestamp = $derived(viewSelection({
		fields: {
			spent: true,
			confirmations: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadMoneroTransferStateView from '$/views/BlockheadMoneroTransferStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadMoneroTransferState_Timestamp}
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
		<ResourceBoundary resource={blockheadMoneroTransferStateTimestamp}>
			{#snippet children(entity)}
				{String(entity.spent ?? '') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadMoneroTransferStateTimestamp}>
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
				<dt>transfer state</dt>
				<dd>
					<BlockheadMoneroTransferStateView
						selection={select(EntityType.BlockheadMoneroTransferState, selection.entitySelector.$transferState)}
						layout={EntityLayout.Value}
						open={false}
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
				resource={blockheadMoneroTransferStateTimestamp}
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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							unlockTime: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const unlockTime = entity.unlockTime}
					{#if unlockTime != null}
						<div>
							<dt>unlock time</dt>
							<dd>
								<NumberValue
									value={unlockTime}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadMoneroTransferStateTimestamp}
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
							lastCheckedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastCheckedAt = entity.lastCheckedAt}
					{#if lastCheckedAt != null}
						<div>
							<dt>last checked AT</dt>
							<dd>
								<Timestamp timestamp={lastCheckedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
