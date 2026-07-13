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
	import { UrlString } from '$/schema/UrlString.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.GitRepository>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.GitRepository>>
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
	const gitRepository = $derived(selection({
		fields: {
			objectFormat: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.repositoryId) ?? ''), String((pendingEntity.canonicalRemoteUrl) ?? '')].filter(Boolean).join(' ') || 'Git repository')
	const viewDomId = $derived('git-repository-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitRefsView from '$/views/GitRefsView.svelte'
	import GitObjectsView from '$/views/GitObjectsView.svelte'
	import GitRemotesView from '$/views/GitRemotesView.svelte'
	import GitFetchObservationsView from '$/views/GitFetchObservationsView.svelte'
</script>


<EntityView
	entityType={EntityType.GitRepository}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={gitRepository}>
			{#snippet Pending()}
				{[String((pendingEntity.repositoryId) ?? ''), String((pendingEntity.canonicalRemoteUrl) ?? '')].filter(Boolean).join(' ') || title || 'Git repository'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.repositoryId) ?? ''), String((resolvedEntity.canonicalRemoteUrl) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitRepository}>
			{#snippet Pending()}
				{[String((pendingEntity.objectFormat) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.repositoryId) ?? ''), String((pendingEntity.canonicalRemoteUrl) ?? '')].filter(Boolean).join(' ') || title || 'Git repository'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.objectFormat) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.repositoryId) ?? ''), String((resolvedEntity.canonicalRemoteUrl) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>repository ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									repositoryId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const repositoryId = pendingEntity.repositoryId}
							{#if repositoryId !== undefined && repositoryId !== null}
								{String((repositoryId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const repositoryId = resolvedEntity.repositoryId}
							{#if repositoryId !== undefined && repositoryId !== null}
								{String((repositoryId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							canonicalRemoteUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const canonicalRemoteUrl = pendingEntity.canonicalRemoteUrl}
					{#if canonicalRemoteUrl !== undefined && canonicalRemoteUrl !== null}
						<div>
							<dt>canonical remote URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(canonicalRemoteUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(canonicalRemoteUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const canonicalRemoteUrl = resolvedEntity.canonicalRemoteUrl}
					{#if canonicalRemoteUrl !== undefined && canonicalRemoteUrl !== null}
						<div>
							<dt>canonical remote URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(canonicalRemoteUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(canonicalRemoteUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>object format</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									objectFormat: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const objectFormat = pendingEntity.objectFormat}
							{#if objectFormat !== undefined && objectFormat !== null}
								{String((objectFormat) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const objectFormat = resolvedEntity.objectFormat}
							{#if objectFormat !== undefined && objectFormat !== null}
								{String((objectFormat) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							defaultRefName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const defaultRefName = pendingEntity.defaultRefName}
					{#if defaultRefName !== undefined && defaultRefName !== null}
						<div>
							<dt>default ref name</dt>
							<dd>
								{String((defaultRefName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const defaultRefName = resolvedEntity.defaultRefName}
					{#if defaultRefName !== undefined && defaultRefName !== null}
						<div>
							<dt>default ref name</dt>
							<dd>
								{String((defaultRefName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-git-repository-objects'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'git-repository-refs',
							label: 'Refs',
						},
						{
							id: 'git-repository-object-list',
							label: 'Objects',
						},
					]
				}
				data-card
				class='network-view-collapsible-refs-objects'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Refs and objects</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionGitRepositoryRefs({ id, label, open })}
					<GitRefsView
						selection={
							selection.$$refs({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No refs.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGitRepositoryObjectList({ id, label, open })}
					<GitObjectsView
						selection={
							selection.$$objects({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No objects.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-git-repository-remotes'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'git-repository-remote-list',
							label: 'Remotes',
						},
						{
							id: 'git-repository-fetches',
							label: 'Fetches',
						},
					]
				}
				data-card
				class='network-view-collapsible-remotes'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Remotes and fetches</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionGitRepositoryRemoteList({ id, label, open })}
					<GitRemotesView
						selection={
							selection.$$remotes({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No remotes.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionGitRepositoryFetches({ id, label, open })}
					<GitFetchObservationsView
						selection={
							selection.$$fetches({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No fetch observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
