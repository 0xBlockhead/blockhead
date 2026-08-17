<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.GitForgeIssueNote> = $props()

	const issue = $derived(selection.entitySelector.$issue)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Gitlab_Rest,
		],
	}))
	const gitForgeIssueNote = $derived(viewSelection({
		fields: {
			body: true,
			noteType: true,
		},
	}))
	const titleFallback = $derived((prefetched.body ?? '') || String(selection.entitySelector.noteId) || 'Git forge issue note')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import GitForgeIssueView from '$/views/GitForgeIssueView.svelte'
</script>


<EntityView
	entityType={EntityType.GitForgeIssueNote}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/issue/[issueNumber=nonNegativeInteger]/(gitForgeIssue)/note/[noteId=nonNegativeInteger]',
				{
					forgeHost: issue.$forgeMirror.forgeHost,
					owner: issue.$forgeMirror.owner,
					repositoryName: issue.$forgeMirror.repositoryName,
					issueNumber: String(issue.issueNumber),
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
		<ResourceBoundary resource={gitForgeIssueNote}>
			{#snippet children(entity)}
				<span data-text="long-text">{entity.body}</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitForgeIssueNote}>
			{#snippet children(entity)}
				{(entity.noteType ?? '') || entity.body || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>issue</dt>
				<dd>
					<GitForgeIssueView
						selection={select(EntityType.GitForgeIssue, selection.entitySelector.$issue)}
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
				resource={gitForgeIssueNote}
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
			resource={gitForgeIssueNote}
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
