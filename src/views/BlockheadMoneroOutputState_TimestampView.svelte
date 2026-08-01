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
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadMoneroOutputState_Timestamp>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadMoneroOutputStateTimestamp = $derived(viewSelection({
		fields: {
			spent: true,
			unlocked: true,
			confirmations: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadMoneroOutputStateView from '$/views/BlockheadMoneroOutputStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadMoneroOutputState_Timestamp}
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
		<ResourceBoundary resource={blockheadMoneroOutputStateTimestamp}>
			{#snippet children(entity)}
				{[String(entity.spent ?? ''), String(entity.unlocked ?? '')].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadMoneroOutputStateTimestamp}>
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
					<BlockheadMoneroOutputStateView
						selection={select(EntityType.BlockheadMoneroOutputState, selection.entitySelector.$outputState)}
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
				resource={blockheadMoneroOutputStateTimestamp}
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
				resource={blockheadMoneroOutputStateTimestamp}
			>
				{#snippet children(entity)}
					{@const unlocked = entity.unlocked}
					{#if unlocked != null}
						<div>
							<dt>unlocked</dt>
							<dd>
								{unlocked ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={blockheadMoneroOutputStateTimestamp}
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
							exportHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const exportHeight = entity.exportHeight}
					{#if exportHeight != null}
						<div>
							<dt>export height</dt>
							<dd>
								<NumberValue
									value={exportHeight}
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
