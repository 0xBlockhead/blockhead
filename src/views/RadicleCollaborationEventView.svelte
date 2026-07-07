<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.RadicleCollaborationEvent>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.RadicleCollaborationEvent>>
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
	const radicleCollaborationEvent = $derived(selection({}))
	const titleFallback = $derived('radicle collaboration event')
	const viewDomId = $derived('radicle-collaboration-event-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import RadicleRepositoryView from '$/views/RadicleRepositoryView.svelte'
	import GitCommitView from '$/views/GitCommitView.svelte'
	import GitObjectView from '$/views/GitObjectView.svelte'
</script>


<EntityView
	entityType={EntityType.RadicleCollaborationEvent}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={radicleCollaborationEvent}>
			{#snippet Pending()}
				{title || 'radicle collaboration event'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>repository</dt>
				<dd>
					<RadicleRepositoryView
						selection={select(EntityType.RadicleRepository, selection.entitySelector.$repository, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>event ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									eventId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const eventId = selection.entitySelector.eventId ?? prefetched.eventId}
							{#if eventId !== undefined && eventId !== null}
								{String((eventId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const eventId = resolvedEntity.eventId}
							{#if eventId !== undefined && eventId !== null}
								{String((eventId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>event kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									eventKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const eventKind = prefetched.eventKind}
							{#if eventKind !== undefined && eventKind !== null}
								{String((eventKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const eventKind = resolvedEntity.eventKind}
							{#if eventKind !== undefined && eventKind !== null}
								{String((eventKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							authorDid: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const authorDid = prefetched.authorDid}
					{#if authorDid !== undefined && authorDid !== null}
						<div>
							<dt>author DID</dt>
							<dd>
								{String((authorDid) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const authorDid = resolvedEntity.authorDid}
					{#if authorDid !== undefined && authorDid !== null}
						<div>
							<dt>author DID</dt>
							<dd>
								{String((authorDid) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							payloadHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const payloadHash = prefetched.payloadHash}
					{#if payloadHash !== undefined && payloadHash !== null}
						<div>
							<dt>payload hash</dt>
							<dd>
								<TruncatedValue value={String((payloadHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const payloadHash = resolvedEntity.payloadHash}
					{#if payloadHash !== undefined && payloadHash !== null}
						<div>
							<dt>payload hash</dt>
							<dd>
								<TruncatedValue value={String((payloadHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							payloadObjectId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const payloadObjectId = prefetched.payloadObjectId}
					{#if payloadObjectId !== undefined && payloadObjectId !== null}
						<div>
							<dt>payload object ID</dt>
							<dd>
								{String((payloadObjectId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const payloadObjectId = resolvedEntity.payloadObjectId}
					{#if payloadObjectId !== undefined && payloadObjectId !== null}
						<div>
							<dt>payload object ID</dt>
							<dd>
								{String((payloadObjectId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							timestampMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const timestampMs = prefetched.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs = resolvedEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.GitCommit, false>('$gitCommit')}
			>
				{#snippet children(gitCommit)}
					{#if gitCommit != null && gitCommit[EntityMetaKey.Selector] != null}
						<div>
							<dt>Git commit</dt>
							<dd>
								<GitCommitView
									selection={select(EntityType.GitCommit, gitCommit[EntityMetaKey.Selector])}
									prefetched={gitCommit}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.GitObject, false>('$payloadObject')}
			>
				{#snippet children(gitObject)}
					{#if gitObject != null && gitObject[EntityMetaKey.Selector] != null}
						<div>
							<dt>payload object</dt>
							<dd>
								<GitObjectView
									selection={select(EntityType.GitObject, gitObject[EntityMetaKey.Selector])}
									prefetched={gitObject}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>verification status</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									verificationStatus: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const verificationStatus = prefetched.verificationStatus}
							{#if verificationStatus !== undefined && verificationStatus !== null}
								{String((verificationStatus) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const verificationStatus = resolvedEntity.verificationStatus}
							{#if verificationStatus !== undefined && verificationStatus !== null}
								{String((verificationStatus) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
