<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.GitForgePullRequestNote> = $props()

	const pullRequest = $derived(selection.entitySelector.$pullRequest)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Gitlab_Rest,
		],
	}))
	const gitForgePullRequestNote = $derived(viewSelection({
		fields: {
			body: true,
			noteType: true,
		},
	}))
	const titleFallback = $derived((prefetched.body ?? '') || String(selection.entitySelector.noteId) || 'Git forge pull request note')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import GitForgePullRequestView from '$/views/GitForgePullRequestView.svelte'
</script>


<EntityView
	entityType={EntityType.GitForgePullRequestNote}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/pull-request/[pullRequestNumber=nonNegativeInteger]/(gitForgePullRequest)/note/[noteId=nonNegativeInteger]',
				{
					forgeHost: pullRequest.$forgeMirror.forgeHost,
					owner: pullRequest.$forgeMirror.owner,
					repositoryName: pullRequest.$forgeMirror.repositoryName,
					pullRequestNumber: String(pullRequest.pullRequestNumber),
					noteId: String(selection.entitySelector.noteId),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={gitForgePullRequestNote}>
			{#snippet children(entity)}
				<span data-text="long-text">{entity.body}</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitForgePullRequestNote}>
			{#snippet children(entity)}
				{(entity.noteType ?? '') || entity.body || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>pull request</dt>
				<dd>
					<GitForgePullRequestView
						selection={select(EntityType.GitForgePullRequest, selection.entitySelector.$pullRequest)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>note ID</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.noteId}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={gitForgePullRequestNote}
			>
				{#snippet children(entity)}
					{@const noteType = entity.noteType}
					{#if noteType != null}
						<div>
							<dt>note type</dt>
							<dd>
								{noteType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>system</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									system: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.system ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							discussionId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const discussionId = entity.discussionId}
					{#if discussionId != null}
						<div>
							<dt>discussion ID</dt>
							<dd>
								{discussionId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							oldPath: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const oldPath = entity.oldPath}
					{#if oldPath != null}
						<div>
							<dt>old path</dt>
							<dd>
								{oldPath}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							newPath: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const newPath = entity.newPath}
					{#if newPath != null}
						<div>
							<dt>new path</dt>
							<dd>
								{newPath}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							oldLine: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const oldLine = entity.oldLine}
					{#if oldLine != null}
						<div>
							<dt>old line</dt>
							<dd>
								<NumberValue
									value={oldLine}
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
							newLine: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const newLine = entity.newLine}
					{#if newLine != null}
						<div>
							<dt>new line</dt>
							<dd>
								<NumberValue
									value={newLine}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									createdAt: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.createdAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Updated</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									updatedAt: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.updatedAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<ResourceBoundary
			resource={gitForgePullRequestNote}
		>
			{#snippet children(entity)}
				{@const body = entity.body}
				{#if body !== ''}
					<p data-text="long-text">{body}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
