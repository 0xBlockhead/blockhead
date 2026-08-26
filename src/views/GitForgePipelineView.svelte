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
	}: EntitySelectionViewProps<EntityType.GitForgePipeline> = $props()

	const forgeMirror = $derived(selection.entitySelector.$forgeMirror)
	const gitForgePipeline = $derived(selection({
		fields: {
			pipelineIid: true,
			status: true,
			ref: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitForgeJobsView from '$/views/GitForgeJobsView.svelte'
	import GitForgeMirrorView from '$/views/GitForgeMirrorView.svelte'
</script>


<EntityView
	entityType={EntityType.GitForgePipeline}
	entitySelector={selection.entitySelector}
	title={title ?? 'Pipeline #' + String(prefetched.pipelineIid ?? '')}
	href={
		href === undefined ?
			resolve(
				'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/pipeline/[pipelineId=nonNegativeInteger]',
				{
					forgeHost: forgeMirror.forgeHost,
					owner: forgeMirror.owner,
					repositoryName: forgeMirror.repositoryName,
					pipelineId: String(selection.entitySelector.pipelineId),
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
		<ResourceBoundary resource={gitForgePipeline}>
			{#snippet children(entity)}
				<span>Pipeline #</span>
				<NumberValue
					value={entity.pipelineIid}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitForgePipeline}>
			{#snippet children(entity)}
				{entity.status || 'Pipeline #' + String(entity.pipelineIid)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={gitForgePipeline}>
			{#snippet children(entity)}
				<span data-text="muted">
					{entity.ref}
				</span>
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
				<dt>pipeline ID</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.pipelineId}
					/>
				</dd>
			</div>

			<div>
				<dt>pipeline IID</dt>
				<dd>
					<ResourceBoundary
						resource={gitForgePipeline}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.pipelineIid}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>ref</dt>
				<dd>
					<ResourceBoundary
						resource={gitForgePipeline}
					>
						{#snippet children(entity)}
							{entity.ref}
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
				<dt>status</dt>
				<dd>
					<ResourceBoundary
						resource={gitForgePipeline}
					>
						{#snippet children(entity)}
							{entity.status}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>pipeline source</dt>
				<dd>
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
							{entity.source}
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

			<div>
				<dt>Updated</dt>
				<dd>
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
							<Timestamp timestamp={entity.updatedAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const jobsResource = selection.$$jobs}
		<ResourceBoundary
			resource={jobsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<GitForgeJobsView
						selection={jobsResource}
						countResource={jobsResource.count}
						title='Jobs'
						id='jobs'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
