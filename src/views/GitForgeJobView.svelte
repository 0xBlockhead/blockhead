<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.GitForgeJob> = $props()

	const pipeline = $derived(selection.entitySelector.$pipeline)
	const gitForgeJob = $derived(selection({
		fields: {
			name: true,
			status: true,
			stage: true,
		},
	}))
	const titleFallback = $derived((prefetched.name ?? '') || 'Git forge job')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitForgePipelineView from '$/views/GitForgePipelineView.svelte'
</script>


<EntityView
	entityType={EntityType.GitForgeJob}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/pipeline/[pipelineId=nonNegativeInteger]/(gitForgePipeline)/job/[jobId=nonNegativeInteger]',
				{
					forgeHost: pipeline.$forgeMirror.forgeHost,
					owner: pipeline.$forgeMirror.owner,
					repositoryName: pipeline.$forgeMirror.repositoryName,
					pipelineId: String(pipeline.pipelineId),
					jobId: String(selection.entitySelector.jobId),
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
		<ResourceBoundary resource={gitForgeJob}>
			{#snippet children(entity)}
				{entity.name || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitForgeJob}>
			{#snippet children(entity)}
				{entity.status || entity.name || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={gitForgeJob}>
			{#snippet children(entity)}
				<span data-text="muted">
					{entity.stage}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>pipeline</dt>
				<dd>
					<GitForgePipelineView
						selection={select(EntityType.GitForgePipeline, selection.entitySelector.$pipeline)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>job ID</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.jobId}
					/>
				</dd>
			</div>

			<div>
				<dt>name</dt>
				<dd>
					<ResourceBoundary
						resource={gitForgeJob}
					>
						{#snippet children(entity)}
							{entity.name}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>stage</dt>
				<dd>
					<ResourceBoundary
						resource={gitForgeJob}
					>
						{#snippet children(entity)}
							{entity.stage}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>status</dt>
				<dd>
					<ResourceBoundary
						resource={gitForgeJob}
					>
						{#snippet children(entity)}
							{entity.status}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>commit object ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									commitObjectId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.commitObjectId} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>URL</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									url: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<a
								href={entity.url}
								target="_blank"
								rel="noreferrer noopener"
							>
								<TruncatedValue value={entity.url} />
							</a>
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
							selection({
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							startedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const startedAt = entity.startedAt}
					{#if startedAt != null}
						<div>
							<dt>Started</dt>
							<dd>
								<Timestamp timestamp={startedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							finishedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const finishedAt = entity.finishedAt}
					{#if finishedAt != null}
						<div>
							<dt>Finished</dt>
							<dd>
								<Timestamp timestamp={finishedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							durationSeconds: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const durationSeconds = entity.durationSeconds}
					{#if durationSeconds != null}
						<div>
							<dt>duration</dt>
							<dd>
								<NumberValue
									value={durationSeconds}
								/>

								<span> s</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							queuedDurationSeconds: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const queuedDurationSeconds = entity.queuedDurationSeconds}
					{#if queuedDurationSeconds != null}
						<div>
							<dt>queued duration</dt>
							<dd>
								<NumberValue
									value={queuedDurationSeconds}
								/>

								<span> s</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
