<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.GitForgeCompare>, 'prefetched'> = $props()

	const forgeMirror = $derived(selection.entitySelector.$forgeMirror)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Gitlab_Rest,
		],
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitCommitsView from '$/views/GitCommitsView.svelte'
	import GitForgeCompareFileChangesView from '$/views/GitForgeCompareFileChangesView.svelte'
	import GitForgeMirrorView from '$/views/GitForgeMirrorView.svelte'
	import GitCommitView from '$/views/GitCommitView.svelte'
</script>


<EntityView
	entityType={EntityType.GitForgeCompare}
	entitySelector={selection.entitySelector}
	title={title ?? ([selection.entitySelector.fromObjectId, selection.entitySelector.toObjectId].filter(Boolean).join(' ') || 'Git forge compare')}
	href={
		href === undefined ?
			resolve(
				'/git/forge/[forgeHost=stringSegment]/[owner=stringSegment]/[repositoryName=stringSegment]/(gitForgeMirror)/compare/[fromObjectId=zeroExHex]/[toObjectId=zeroExHex]',
				{
					forgeHost: forgeMirror.forgeHost,
					owner: forgeMirror.owner,
					repositoryName: forgeMirror.repositoryName,
					fromObjectId: selection.entitySelector.fromObjectId,
					toObjectId: selection.entitySelector.toObjectId,
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
		<GitForgeMirrorView
			selection={select(EntityType.GitForgeMirror, selection.entitySelector.$forgeMirror)}
			href={null}
			layout={EntityLayout.Value}
		/>
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
				<dt>from object ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.fromObjectId} />
				</dd>
			</div>

			<div>
				<dt>to object ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.toObjectId} />
				</dd>
			</div>

			<div>
				<dt>from commit</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$fromCommit}
					>
						{#snippet children(gitCommit)}
							{@const gitCommitInitial = untrack(() => gitCommit)}
							<GitCommitView
								selection={select(EntityType.GitCommit, (gitCommit ?? gitCommitInitial)[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>to commit</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$toCommit}
					>
						{#snippet children(gitCommit)}
							{@const gitCommitInitial = untrack(() => gitCommit)}
							<GitCommitView
								selection={select(EntityType.GitCommit, (gitCommit ?? gitCommitInitial)[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>same ref</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									sameRef: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.sameRef ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>timed out</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									timedOut: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.timedOut ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const commitsResource = selection.$$commits}
		<ResourceBoundary
			resource={commitsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<GitCommitsView
						selection={commitsResource}
						countResource={commitsResource.count}
						title='commits'
						id='commits'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const fileChangesResource = selection.$$fileChanges}
		<ResourceBoundary
			resource={fileChangesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<GitForgeCompareFileChangesView
						selection={fileChangesResource}
						countResource={fileChangesResource.count}
						title='file changes'
						id='file-changes'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
