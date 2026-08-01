<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.GitTreePathResolution> = $props()

	const gitTreePathResolution = $derived(selection({
		fields: {
			status: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.path || 'Git tree path resolution')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitRepositoryView from '$/views/GitRepositoryView.svelte'
</script>


<EntityView
	entityType={EntityType.GitTreePathResolution}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={gitTreePathResolution}>
			{#snippet children(entity)}
				{entity.status || selection.entitySelector.path || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<TruncatedValue value={selection.entitySelector.commitObjectId} />
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>repository</dt>
				<dd>
					<GitRepositoryView
						selection={select(EntityType.GitRepository, selection.entitySelector.$repository)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>commit object ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.commitObjectId} />
				</dd>
			</div>

			<div>
				<dt>path</dt>
				<dd>
					{selection.entitySelector.path}
				</dd>
			</div>

			<div>
				<dt>tree object ids</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									treeObjectIds: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.treeObjectIds.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							blobObjectId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blobObjectId = entity.blobObjectId}
					{#if blobObjectId != null}
						<div>
							<dt>blob object ID</dt>
							<dd>
								<TruncatedValue value={blobObjectId} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							submoduleCommitId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const submoduleCommitId = entity.submoduleCommitId}
					{#if submoduleCommitId != null}
						<div>
							<dt>submodule commit ID</dt>
							<dd>
								<TruncatedValue value={submoduleCommitId} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>status</dt>
				<dd>
					<ResourceBoundary
						resource={gitTreePathResolution}
					>
						{#snippet children(entity)}
							{entity.status}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
