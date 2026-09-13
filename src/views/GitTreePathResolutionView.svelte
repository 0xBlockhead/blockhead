<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.GitTreePathResolution>, 'prefetched'> = $props()

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
	import GitBlobView from '$/views/GitBlobView.svelte'
</script>


<EntityView
	entityType={EntityType.GitTreePathResolution}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				selection.entitySelector.$repository.canonicalRemoteUrl !== undefined ?
					resolve(
						'/git/repository/remote/[canonicalRemoteUrl=absoluteUrl]/(gitRepository)/commit/[commitObjectId=zeroExHex]/path/[path=stringSegment]',
						{
							canonicalRemoteUrl: encodeURIComponent(selection.entitySelector.$repository.canonicalRemoteUrl),
							commitObjectId: selection.entitySelector.commitObjectId,
							path: selection.entitySelector.path,
						}
					)
				:
					undefined
			)
		:
			href ?? undefined
	}
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
						resource={selection.treeObjectIds}
					>
						{#snippet children(treeObjectIds)}
							{treeObjectIds.values.join(', ')}
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
				resource={selection.$blob}
			>
				{#snippet children(gitBlob)}
					{#if gitBlob != null}
						<div>
							<dt>Blob</dt>
							<dd>
								<GitBlobView
									selection={select(EntityType.GitBlob, gitBlob[EntityMetaKey.Selector])}
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
