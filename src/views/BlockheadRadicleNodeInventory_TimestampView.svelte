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
	}: EntitySelectionViewProps<EntityType.BlockheadRadicleNodeInventory_Timestamp> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadRadicleNodeInventoryTimestamp = $derived(viewSelection({
		fields: {
			status: true,
			repositoryCount: true,
		},
	}))
	const titleFallback = $derived((prefetched.status ?? '') || 'blockhead radicle node inventory timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadRadicleNodeStateView from '$/views/BlockheadRadicleNodeStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadRadicleNodeInventory_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadRadicleNodeInventoryTimestamp}>
			{#snippet children(entity)}
				{entity.status || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadRadicleNodeInventoryTimestamp}>
			{#snippet children(entity)}
				{@const repositoryCount = entity.repositoryCount}
				{#if repositoryCount != null}
					<span data-text="muted">
						<NumberValue
							value={repositoryCount}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>node</dt>
				<dd>
					<BlockheadRadicleNodeStateView
						selection={select(EntityType.BlockheadRadicleNodeState, selection.entitySelector.$node)}
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

			<div>
				<dt>status</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadRadicleNodeInventoryTimestamp}
					>
						{#snippet children(entity)}
							{entity.status}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={blockheadRadicleNodeInventoryTimestamp}
			>
				{#snippet children(entity)}
					{@const repositoryCount = entity.repositoryCount}
					{#if repositoryCount != null}
						<div>
							<dt>repository count</dt>
							<dd>
								<NumberValue
									value={repositoryCount}
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
							connectedPeerCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const connectedPeerCount = entity.connectedPeerCount}
					{#if connectedPeerCount != null}
						<div>
							<dt>connected peer count</dt>
							<dd>
								<NumberValue
									value={connectedPeerCount}
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
							routingTableSize: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const routingTableSize = entity.routingTableSize}
					{#if routingTableSize != null}
						<div>
							<dt>routing table size</dt>
							<dd>
								<NumberValue
									value={routingTableSize}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>advertised rids</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									advertisedRids: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.advertisedRids.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
