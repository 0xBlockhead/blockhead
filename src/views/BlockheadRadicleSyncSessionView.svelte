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
	}: EntitySelectionViewProps<EntityType.BlockheadRadicleSyncSession> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadRadicleSyncSession = $derived(viewSelection({
		fields: {
			remoteNodeId: true,
			startedAt: true,
			status: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.sessionId ?? '') || 'blockhead radicle sync session')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadRadicleNodeStateView from '$/views/BlockheadRadicleNodeStateView.svelte'
	import RadicleRepositoryView from '$/views/RadicleRepositoryView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadRadicleSyncSession}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.sessionId ?? '') || 'blockhead radicle sync session'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadRadicleSyncSession}>
			{#snippet children(entity)}
				{entity.status || pendingEntity.sessionId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadRadicleSyncSession}>
			{#snippet children(entity)}
				<span data-text="muted">
					<Timestamp timestamp={Number(entity.startedAt)} />
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>session ID</dt>
				<dd>
					{pendingEntity.sessionId}
				</dd>
			</div>

			<div>
				<dt>local node</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$localNode}
					>
						{#snippet children(blockheadRadicleNodeState)}
							<BlockheadRadicleNodeStateView
								selection={select(EntityType.BlockheadRadicleNodeState, blockheadRadicleNodeState[EntityMetaKey.Selector])}
								prefetched={blockheadRadicleNodeState}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>remote node ID</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadRadicleSyncSession}
					>
						{#snippet children(entity)}
							{entity.remoteNodeId}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$repository}
			>
				{#snippet children(radicleRepository)}
					{#if radicleRepository != null}
						<div>
							<dt>repository</dt>
							<dd>
								<RadicleRepositoryView
									selection={select(EntityType.RadicleRepository, radicleRepository[EntityMetaKey.Selector])}
									prefetched={radicleRepository}
									layout={EntityLayout.Value}
									open={false}
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
							rid: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rid = entity.rid}
					{#if rid != null}
						<div>
							<dt>rid</dt>
							<dd>
								{rid}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>started AT</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadRadicleSyncSession}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={Number(entity.startedAt)} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							completedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const completedAt = entity.completedAt}
					{#if completedAt != null}
						<div>
							<dt>completed AT</dt>
							<dd>
								<Timestamp timestamp={Number(completedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>requested refs</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									requestedRefs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.requestedRefs.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							receivedObjects: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const receivedObjects = entity.receivedObjects}
					{#if receivedObjects != null}
						<div>
							<dt>received objects</dt>
							<dd>
								<NumberValue
									value={receivedObjects}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>status</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadRadicleSyncSession}
					>
						{#snippet children(entity)}
							{entity.status}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const error = entity.error}
					{#if error != null}
						<div>
							<dt>error</dt>
							<dd>
								{error}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
