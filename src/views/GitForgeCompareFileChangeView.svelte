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
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.GitForgeCompareFileChange>, 'prefetched'> = $props()

	const compare = $derived(selection.entitySelector.$compare)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Gitlab_Rest,
		],
	}))
	const titleFallback = $derived(selection.entitySelector.newPath || 'Git forge compare file change')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import GitForgeCompareView from '$/views/GitForgeCompareView.svelte'
</script>


<EntityView
	entityType={EntityType.GitForgeCompareFileChange}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/compare/[fromObjectId=zeroExHex]/[toObjectId=zeroExHex]/(gitForgeCompare)/file/[oldPath=stringSegment]/[newPath=stringSegment]',
				{
					forgeHost: compare.$forgeMirror.forgeHost,
					owner: compare.$forgeMirror.owner,
					repositoryName: compare.$forgeMirror.repositoryName,
					fromObjectId: compare.fromObjectId,
					toObjectId: compare.toObjectId,
					oldPath: encodeURIComponent(selection.entitySelector.oldPath),
					newPath: encodeURIComponent(selection.entitySelector.newPath),
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
		{selection.entitySelector.oldPath || selection.entitySelector.newPath || titleFallback}
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>compare</dt>
				<dd>
					<GitForgeCompareView
						selection={select(EntityType.GitForgeCompare, selection.entitySelector.$compare)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>old path</dt>
				<dd>
					{selection.entitySelector.oldPath}
				</dd>
			</div>

			<div>
				<dt>new path</dt>
				<dd>
					{selection.entitySelector.newPath}
				</dd>
			</div>

			<div>
				<dt>old mode</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									oldMode: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.oldMode}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>new mode</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									newMode: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.newMode}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>new file</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									newFile: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.newFile ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>renamed file</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									renamedFile: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.renamedFile ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>deleted file</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									deletedFile: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.deletedFile ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							tooLarge: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tooLarge = entity.tooLarge}
					{#if tooLarge != null}
						<div>
							<dt>too large</dt>
							<dd>
								{tooLarge ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
