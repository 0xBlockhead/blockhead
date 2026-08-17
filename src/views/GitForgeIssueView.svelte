<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.GitForgeIssue> = $props()

	const forgeMirror = $derived(selection.entitySelector.$forgeMirror)
	const gitForgeIssue = $derived(selection({
		fields: {
			title: true,
			state: true,
		},
	}))
	const titleFallback = $derived((prefetched.title ?? '') || String(selection.entitySelector.issueNumber) || 'Git forge issue')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import GitForgeIssueNotesView from '$/views/GitForgeIssueNotesView.svelte'
	import GitForgeMirrorView from '$/views/GitForgeMirrorView.svelte'
</script>


<EntityView
	entityType={EntityType.GitForgeIssue}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/issue/[issueNumber=nonNegativeInteger]',
				{
					forgeHost: forgeMirror.forgeHost,
					owner: forgeMirror.owner,
					repositoryName: forgeMirror.repositoryName,
					issueNumber: String(selection.entitySelector.issueNumber),
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
		<ResourceBoundary resource={gitForgeIssue}>
			{#snippet children(entity)}
				{(entity.title ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitForgeIssue}>
			{#snippet children(entity)}
				{entity.state || (entity.title ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>forge mirror</dt>
				<dd>
					<GitForgeMirrorView
						selection={select(EntityType.GitForgeMirror, selection.entitySelector.$forgeMirror)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>issue number</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.issueNumber}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={gitForgeIssue}
			>
				{#snippet children(entity)}
					{@const title = entity.title}
					{#if title != null}
						<div>
							<dt>title</dt>
							<dd>
								{title}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>state</dt>
				<dd>
					<ResourceBoundary
						resource={gitForgeIssue}
					>
						{#snippet children(entity)}
							{entity.state}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>labels</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									labels: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.labels.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							createdAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const createdAt = entity.createdAt}
					{#if createdAt != null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={createdAt} />
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
				{#snippet children(entity)}
					{@const updatedAt = entity.updatedAt}
					{#if updatedAt != null}
						<div>
							<dt>Updated</dt>
							<dd>
								<Timestamp timestamp={updatedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							closedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const closedAt = entity.closedAt}
					{#if closedAt != null}
						<div>
							<dt>closed AT</dt>
							<dd>
								<Timestamp timestamp={closedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const notesResource = selection.$$notes}
		<ResourceBoundary
			resource={notesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<GitForgeIssueNotesView
						selection={notesResource}
						countResource={notesResource.count}
						title='Comments'
						id='notes'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
