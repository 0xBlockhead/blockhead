<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.GitRepository> = $props()

	const gitRepository = $derived(selection({
		fields: {
			repositoryId: true,
			canonicalRemoteUrl: true,
			objectFormat: true,
		},
	}))
	const titleFallback = $derived([(prefetched.repositoryId ?? ''), (prefetched.canonicalRemoteUrl ?? '')].filter(Boolean).join(' ') || 'Git repository')
	const viewDomId = $derived('git-repository-' + encodeURIComponent(stringify(selection.entitySelector)))


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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={gitRepository}>
			{#snippet children(entity)}
				{[entity.repositoryId, (entity.canonicalRemoteUrl ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitRepository}>
			{#snippet children(entity)}
				{entity.objectFormat || [entity.repositoryId, (entity.canonicalRemoteUrl ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>repository ID</dt>
				<dd>
					<ResourceBoundary
						resource={gitRepository}
					>
						{#snippet children(entity)}
							{entity.repositoryId}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={gitRepository}
			>
				{#snippet children(entity)}
					{@const canonicalRemoteUrl = entity.canonicalRemoteUrl}
					{#if canonicalRemoteUrl != null}
						<div>
							<dt>canonical remote URL</dt>
							<dd>
								<a
									href={canonicalRemoteUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={canonicalRemoteUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>object format</dt>
				<dd>
					<ResourceBoundary
						resource={gitRepository}
					>
						{#snippet children(entity)}
							{entity.objectFormat}
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
				{#snippet children(entity)}
					{@const defaultRefName = entity.defaultRefName}
					{#if defaultRefName != null}
						<div>
							<dt>default ref name</dt>
							<dd>
								{defaultRefName}
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
					},
					{
						id: 'git-repository-object-list',
						label: 'Objects',
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

			{#snippet SectionGitRepositoryRefs({ id, label, open })}
				<GitRefsView
					selection={selection.$$refs}
					collapsible={false}
					title={label}
					emptyText='No refs.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGitRepositoryObjectList({ id, label, open })}
				<GitObjectsView
					selection={selection.$$objects}
					collapsible={false}
					title={label}
					emptyText='No objects.'
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Remotes and fetches</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionGitRepositoryRemoteList({ id, label, open })}
				<GitRemotesView
					selection={selection.$$remotes}
					collapsible={false}
					title={label}
					emptyText='No remotes.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionGitRepositoryFetches({ id, label, open })}
				<GitFetchObservationsView
					selection={selection.$$fetches}
					collapsible={false}
					title={label}
					emptyText='No fetch observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
