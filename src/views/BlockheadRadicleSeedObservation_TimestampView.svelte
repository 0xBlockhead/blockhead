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
	}: EntitySelectionViewProps<EntityType.BlockheadRadicleSeedObservation_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const titleFallback = $derived((pendingEntity.nodeId ?? '') || 'blockhead radicle seed observation timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import RadicleRepositoryView from '$/views/RadicleRepositoryView.svelte'
	import BlockheadRadicleNodeStateView from '$/views/BlockheadRadicleNodeStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadRadicleSeedObservation_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.nodeId ?? '') || 'blockhead radicle seed observation timestamp'}
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<RadicleRepositoryView
				selection={select(EntityType.RadicleRepository, selection.entitySelector.$repository)}
				layout={EntityLayout.Title}
				open={false}
			/>
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>repository</dt>
				<dd>
					<RadicleRepositoryView
						selection={select(EntityType.RadicleRepository, selection.entitySelector.$repository)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>node ID</dt>
				<dd>
					{pendingEntity.nodeId}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$observerNode}
			>
				{#snippet children(blockheadRadicleNodeState)}
					{#if blockheadRadicleNodeState != null}
						<div>
							<dt>observer node</dt>
							<dd>
								<BlockheadRadicleNodeStateView
									selection={select(EntityType.BlockheadRadicleNodeState, blockheadRadicleNodeState[EntityMetaKey.Selector])}
									prefetched={blockheadRadicleNodeState}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							advertised: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const advertised = entity.advertised}
					{#if advertised != null}
						<div>
							<dt>advertised</dt>
							<dd>
								{advertised ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							reachable: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const reachable = entity.reachable}
					{#if reachable != null}
						<div>
							<dt>reachable</dt>
							<dd>
								{reachable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							refCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const refCount = entity.refCount}
					{#if refCount != null}
						<div>
							<dt>ref count</dt>
							<dd>
								<NumberValue
									value={refCount}
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
							objectCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const objectCount = entity.objectCount}
					{#if objectCount != null}
						<div>
							<dt>object count</dt>
							<dd>
								<NumberValue
									value={objectCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
