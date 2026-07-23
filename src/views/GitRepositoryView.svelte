<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
			selection: RegisteredEntityProxyResource<EntityType.GitRepository>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.GitRepository>
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
	const gitRepository = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			objectFormat: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			objectFormat: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.repositoryId) ?? ''), String((pendingEntity.canonicalRemoteUrl) ?? '')].filter(Boolean).join(' ') || 'Git repository')
	const viewDomId = $derived('git-repository-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'repositoryId') && Object.hasOwn(prefetched, 'canonicalRemoteUrl') && Object.hasOwn(prefetched, 'objectFormat')}
			{[String((pendingEntity.repositoryId) ?? ''), String((pendingEntity.canonicalRemoteUrl) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={gitRepository}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.repositoryId) ?? ''), String((resolvedEntity.canonicalRemoteUrl) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'repositoryId') && Object.hasOwn(prefetched, 'canonicalRemoteUrl') && Object.hasOwn(prefetched, 'objectFormat')}
			{[String((pendingEntity.objectFormat) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.repositoryId) ?? ''), String((pendingEntity.canonicalRemoteUrl) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={gitRepository}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.objectFormat) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.repositoryId) ?? ''), String((resolvedEntity.canonicalRemoteUrl) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>repository ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									repositoryId: true,
								},
							})
						}
					>
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
						sources: selection.sources,
						fields: {
							canonicalRemoteUrl: true,
						},
					})
				}
			>
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
								sources: selection.sources,
								fields: {
									objectFormat: true,
								},
							})
						}
					>
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
						sources: selection.sources,
						fields: {
							defaultRefName: true,
						},
					})
				}
			>
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
		<CollapsibleTabs
			id={viewDomId + '-carousel-git-repository-objects'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'git-repository-refs',
						label: 'Refs',
						ownsSection: true,
					},
					{
						id: 'git-repository-object-list',
						label: 'Objects',
						ownsSection: true,
					},
				]
			}
			data-card
			class='network-view-collapsible-refs-objects'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Refs and objects</HeadingComponent>
				</header>
			{/snippet}

			{#snippet MarkerGitRepositoryRefs(_context, Content)}
				{@const gitRepositoryObjectsGitRepositoryRefsResource = selection.$$refs}
				<ResourceBoundary
					resource={gitRepositoryObjectsGitRepositoryRefsResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionGitRepositoryRefs({ id, label, open, active })}
				{@const gitRepositoryObjectsGitRepositoryRefsResource = selection.$$refs}
				<ResourceBoundary
					resource={gitRepositoryObjectsGitRepositoryRefsResource}
				>
					{#snippet children(gitRef)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<GitRefsView
								selection={gitRepositoryObjectsGitRepositoryRefsResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No refs.'
								id={`${id}-list`}
							/>
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet MarkerGitRepositoryObjectList(_context, Content)}
				{@const gitRepositoryObjectsGitRepositoryObjectListResource = selection.$$objects}
				<ResourceBoundary
					resource={gitRepositoryObjectsGitRepositoryObjectListResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionGitRepositoryObjectList({ id, label, open, active })}
				{@const gitRepositoryObjectsGitRepositoryObjectListResource = selection.$$objects}
				<ResourceBoundary
					resource={gitRepositoryObjectsGitRepositoryObjectListResource}
				>
					{#snippet children(gitObject)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<GitObjectsView
								selection={gitRepositoryObjectsGitRepositoryObjectListResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No objects.'
								id={`${id}-list`}
							/>
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
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
						ownsSection: true,
					},
					{
						id: 'git-repository-fetches',
						label: 'Fetches',
						ownsSection: true,
					},
				]
			}
			data-card
			class='network-view-collapsible-remotes'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Remotes and fetches</HeadingComponent>
				</header>
			{/snippet}

			{#snippet MarkerGitRepositoryRemoteList(_context, Content)}
				{@const gitRepositoryRemotesGitRepositoryRemoteListResource = selection.$$remotes}
				<ResourceBoundary
					resource={gitRepositoryRemotesGitRepositoryRemoteListResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionGitRepositoryRemoteList({ id, label, open, active })}
				{@const gitRepositoryRemotesGitRepositoryRemoteListResource = selection.$$remotes}
				<ResourceBoundary
					resource={gitRepositoryRemotesGitRepositoryRemoteListResource}
				>
					{#snippet children(gitRemote)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<GitRemotesView
								selection={gitRepositoryRemotesGitRepositoryRemoteListResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No remotes.'
								id={`${id}-list`}
							/>
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet MarkerGitRepositoryFetches(_context, Content)}
				{@const gitRepositoryRemotesGitRepositoryFetchesResource = selection.$$fetches}
				<ResourceBoundary
					resource={gitRepositoryRemotesGitRepositoryFetchesResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionGitRepositoryFetches({ id, label, open, active })}
				{@const gitRepositoryRemotesGitRepositoryFetchesResource = selection.$$fetches}
				<ResourceBoundary
					resource={gitRepositoryRemotesGitRepositoryFetchesResource}
				>
					{#snippet children(gitFetchObservation)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<GitFetchObservationsView
								selection={gitRepositoryRemotesGitRepositoryFetchesResource}
								CollapsibleProps={{ canToggle: false }}
								collapsible={false}
								data-column-item="flexible"
								data-card
								data-scroll-container
								open={open}
								title={label}
								emptyText='No fetch observations.'
								id={`${id}-list`}
							/>
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
