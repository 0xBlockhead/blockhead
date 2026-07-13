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
			selection: EntityProxyResource<typeof schema, EntityType.RadicleIssue>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.RadicleIssue>>
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
	const radicleIssue = $derived(selection({}))
	const titleFallback = $derived('radicle issue')
	const viewDomId = $derived('radicle-issue-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import RadicleRepositoryView from '$/views/RadicleRepositoryView.svelte'
	import GitObjectView from '$/views/GitObjectView.svelte'
</script>


<EntityView
	entityType={EntityType.RadicleIssue}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={radicleIssue}>
			{#snippet Pending()}
				{title || 'radicle issue'}
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
				<dt>issue ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									issueId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const issueId = pendingEntity.issueId}
							{#if issueId !== undefined && issueId !== null}
								{String((issueId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const issueId = resolvedEntity.issueId}
							{#if issueId !== undefined && issueId !== null}
								{String((issueId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							title: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const title = pendingEntity.title}
					{#if title !== undefined && title !== null}
						<div>
							<dt>title</dt>
							<dd>
								{String((title) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const title = resolvedEntity.title}
					{#if title !== undefined && title !== null}
						<div>
							<dt>title</dt>
							<dd>
								{String((title) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
					{@const authorDid = pendingEntity.authorDid}
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

			<div>
				<dt>state</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									state: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const state = pendingEntity.state}
							{#if state !== undefined && state !== null}
								{String((state) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const state = resolvedEntity.state}
							{#if state !== undefined && state !== null}
								{String((state) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							createdAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const createdAt = pendingEntity.createdAt}
					{#if createdAt !== undefined && createdAt !== null}
						<div>
							<dt>Created</dt>
							<dd>
								{String((createdAt) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const createdAt = resolvedEntity.createdAt}
					{#if createdAt !== undefined && createdAt !== null}
						<div>
							<dt>Created</dt>
							<dd>
								{String((createdAt) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							updatedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const updatedAt = pendingEntity.updatedAt}
					{#if updatedAt !== undefined && updatedAt !== null}
						<div>
							<dt>Updated</dt>
							<dd>
								{String((updatedAt) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const updatedAt = resolvedEntity.updatedAt}
					{#if updatedAt !== undefined && updatedAt !== null}
						<div>
							<dt>Updated</dt>
							<dd>
								{String((updatedAt) ?? '')}
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
					{@const payloadObjectId = pendingEntity.payloadObjectId}
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
				resource={selection.$payloadObject}
			>
				{#snippet Pending()}{/snippet}

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
		</dl>
	{/snippet}
</EntityView>
