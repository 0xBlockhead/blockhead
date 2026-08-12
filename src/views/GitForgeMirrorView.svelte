<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.GitForgeMirror>, 'prefetched'> = $props()

	const titleFallback = $derived([selection.entitySelector.owner, selection.entitySelector.repositoryName].filter(Boolean).join(' ') || 'Git forge mirror')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitForgeIssuesView from '$/views/GitForgeIssuesView.svelte'
	import GitForgePullRequestsView from '$/views/GitForgePullRequestsView.svelte'
	import GitForgeReleasesView from '$/views/GitForgeReleasesView.svelte'
	import GitRepositoryView from '$/views/GitRepositoryView.svelte'
</script>


<EntityView
	entityType={EntityType.GitForgeMirror}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]',
				{
					forgeHost: selection.entitySelector.forgeHost,
					owner: selection.entitySelector.owner,
					repositoryName: selection.entitySelector.repositoryName,
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
		{selection.entitySelector.forgeHost || [selection.entitySelector.owner, selection.entitySelector.repositoryName].filter(Boolean).join(' ') || titleFallback}
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>forge host</dt>
				<dd>
					{selection.entitySelector.forgeHost}
				</dd>
			</div>

			<div>
				<dt>owner</dt>
				<dd>
					{selection.entitySelector.owner}
				</dd>
			</div>

			<div>
				<dt>repository name</dt>
				<dd>
					{selection.entitySelector.repositoryName}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$gitRepository}
			>
				{#snippet children(gitRepository)}
					{#if gitRepository != null}
						{@const gitRepositoryInitial = untrack(() => gitRepository)}
						<div>
							<dt>Git repository</dt>
							<dd>
								<GitRepositoryView
									selection={select(EntityType.GitRepository, (gitRepository ?? gitRepositoryInitial)[EntityMetaKey.Selector])}
									prefetched={gitRepository ?? gitRepositoryInitial}
									layout={EntityLayout.Value}
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
							defaultBranch: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const defaultBranch = entity.defaultBranch}
					{#if defaultBranch != null}
						<div>
							<dt>default branch</dt>
							<dd>
								{defaultBranch}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							visibility: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const visibility = entity.visibility}
					{#if visibility != null}
						<div>
							<dt>visibility</dt>
							<dd>
								{visibility}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							htmlUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const htmlUrl = entity.htmlUrl}
					{#if htmlUrl != null}
						<div>
							<dt>HTML URL</dt>
							<dd>
								<a
									href={htmlUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={htmlUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							providerRepositoryId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const providerRepositoryId = entity.providerRepositoryId}
					{#if providerRepositoryId != null}
						<div>
							<dt>provider repository ID</dt>
							<dd>
								{providerRepositoryId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							source: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const source = entity.source}
					{#if source != null}
						<div>
							<dt>Source</dt>
							<dd>
								{source}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>clone urls</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									cloneUrls: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.cloneUrls.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const issuesResource = selection.$$issues}
		<ResourceBoundary
			resource={issuesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<GitForgeIssuesView
						selection={issuesResource}
						countResource={issuesResource.count}
						title='Issues'
						id='issues'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const pullRequestsResource = selection.$$pullRequests}
		<ResourceBoundary
			resource={pullRequestsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<GitForgePullRequestsView
						selection={pullRequestsResource}
						countResource={pullRequestsResource.count}
						title='Merge requests'
						id='pull-requests'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const releasesResource = selection.$$releases}
		<ResourceBoundary
			resource={releasesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<GitForgeReleasesView
						selection={releasesResource}
						countResource={releasesResource.count}
						title='Releases'
						id='releases'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
