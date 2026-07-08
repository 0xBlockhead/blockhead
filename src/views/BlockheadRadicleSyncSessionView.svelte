<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadRadicleSyncSession>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadRadicleSyncSession>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const blockheadRadicleSyncSession = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			$localNode: true,
			remoteNodeId: true,
			startedAt: true,
			status: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.sessionId ?? prefetched.sessionId) ?? '')].filter(Boolean).join(' ') || 'blockhead radicle sync session')
	const viewDomId = $derived('blockhead-radicle-sync-session-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadRadicleNodeStateView from '$/views/BlockheadRadicleNodeStateView.svelte'
	import RadicleRepositoryView from '$/views/RadicleRepositoryView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadRadicleSyncSession}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadRadicleSyncSession}>
			{#snippet Pending()}
				{[String((selection.entitySelector.sessionId ?? prefetched.sessionId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead radicle sync session'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.sessionId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadRadicleSyncSession}>
			{#snippet Pending()}
				{[String((prefetched.status) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.sessionId ?? prefetched.sessionId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead radicle sync session'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.status) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.sessionId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadRadicleSyncSession}>
			{#snippet Pending()}
				{@const startedAt0 = prefetched.startedAt}
				{#if startedAt0 !== undefined && startedAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(startedAt0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const startedAt0 = resolvedEntity.startedAt}
				{#if startedAt0 !== undefined && startedAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(startedAt0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>session ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									sessionId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const sessionId = selection.entitySelector.sessionId ?? prefetched.sessionId}
							{#if sessionId !== undefined && sessionId !== null}
								{String((sessionId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const sessionId = resolvedEntity.sessionId}
							{#if sessionId !== undefined && sessionId !== null}
								{String((sessionId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>local node</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$localNode}
					>
						{#snippet children(blockheadRadicleNodeState)}
							{#if blockheadRadicleNodeState[EntityMetaKey.Selector] != null}
								<BlockheadRadicleNodeStateView
									selection={select(EntityType.BlockheadRadicleNodeState, blockheadRadicleNodeState[EntityMetaKey.Selector])}
									prefetched={blockheadRadicleNodeState}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>remote node ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									remoteNodeId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const remoteNodeId = prefetched.remoteNodeId}
							{#if remoteNodeId !== undefined && remoteNodeId !== null}
								{String((remoteNodeId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const remoteNodeId = resolvedEntity.remoteNodeId}
							{#if remoteNodeId !== undefined && remoteNodeId !== null}
								{String((remoteNodeId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$repository}
			>
				{#snippet children(radicleRepository)}
					{#if radicleRepository != null && radicleRepository[EntityMetaKey.Selector] != null}
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
					selection({
						fields: {
							rid: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const rid = prefetched.rid}
					{#if rid !== undefined && rid !== null}
						<div>
							<dt>rid</dt>
							<dd>
								{String((rid) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rid = resolvedEntity.rid}
					{#if rid !== undefined && rid !== null}
						<div>
							<dt>rid</dt>
							<dd>
								{String((rid) ?? '')}
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
						resource={
							selection({
								fields: {
									startedAt: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const startedAt = prefetched.startedAt}
							{#if startedAt !== undefined && startedAt !== null}
								<Timestamp timestamp={Number(startedAt)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const startedAt = resolvedEntity.startedAt}
							{#if startedAt !== undefined && startedAt !== null}
								<Timestamp timestamp={Number(startedAt)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							completedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const completedAt = prefetched.completedAt}
					{#if completedAt !== undefined && completedAt !== null}
						<div>
							<dt>completed AT</dt>
							<dd>
								<Timestamp timestamp={Number(completedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const completedAt = resolvedEntity.completedAt}
					{#if completedAt !== undefined && completedAt !== null}
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
							selection({
								fields: {
									requestedRefs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const requestedRefs = prefetched.requestedRefs}
							{#if requestedRefs !== undefined && requestedRefs !== null}
								{requestedRefs.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const requestedRefs = resolvedEntity.requestedRefs}
							{#if requestedRefs !== undefined && requestedRefs !== null}
								{requestedRefs.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							receivedObjects: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const receivedObjects = prefetched.receivedObjects}
					{#if receivedObjects !== undefined && receivedObjects !== null}
						<div>
							<dt>received objects</dt>
							<dd>
								<NumberValue value={Number(receivedObjects)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const receivedObjects = resolvedEntity.receivedObjects}
					{#if receivedObjects !== undefined && receivedObjects !== null}
						<div>
							<dt>received objects</dt>
							<dd>
								<NumberValue value={Number(receivedObjects)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>status</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									status: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const status = prefetched.status}
							{#if status !== undefined && status !== null}
								{String((status) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const status = resolvedEntity.status}
							{#if status !== undefined && status !== null}
								{String((status) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const error = prefetched.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const error = resolvedEntity.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
