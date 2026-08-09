<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadRadicleSeedObservation_Timestamp>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))


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
	title={title ?? (selection.entitySelector.nodeId || 'blockhead radicle seed observation timestamp')}
	href={
		href === undefined ?
			resolve(
				'/radicle/repository/[rid=stringSegment]/(radicleRepository)/seed/[nodeId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					rid: selection.entitySelector.$repository.rid,
					nodeId: selection.entitySelector.nodeId,
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
	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<RadicleRepositoryView
				selection={select(EntityType.RadicleRepository, selection.entitySelector.$repository)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>repository</dt>
				<dd>
					<RadicleRepositoryView
						selection={select(EntityType.RadicleRepository, selection.entitySelector.$repository)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>node ID</dt>
				<dd>
					{selection.entitySelector.nodeId}
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
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
