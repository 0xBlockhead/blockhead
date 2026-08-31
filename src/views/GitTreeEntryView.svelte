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
	}: Omit<EntitySelectionViewProps<EntityType.GitTreeEntry>, 'prefetched'> = $props()

	const tree = $derived(selection.entitySelector.$tree)
	const gitTreeEntry = $derived(selection({
		fields: {
			objectKind: true,
			mode: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.path || 'Git tree entry')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GitTreeView from '$/views/GitTreeView.svelte'
	import GitObjectView from '$/views/GitObjectView.svelte'
</script>


<EntityView
	entityType={EntityType.GitTreeEntry}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/git/tree/[objectId=zeroExHex]/[objectFormat=stringSegment]/(gitTree)/entry/[path=stringSegment]',
				{
					objectId: tree.objectId,
					objectFormat: tree.objectFormat,
					path: selection.entitySelector.path,
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
		<ResourceBoundary resource={gitTreeEntry}>
			{#snippet children(entity)}
				{entity.objectKind || selection.entitySelector.path || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={gitTreeEntry}>
			{#snippet children(entity)}
				<span data-text="muted">
					{entity.mode}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>tree</dt>
				<dd>
					<GitTreeView
						selection={select(EntityType.GitTree, selection.entitySelector.$tree)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>path</dt>
				<dd>
					{selection.entitySelector.path}
				</dd>
			</div>

			<div>
				<dt>mode</dt>
				<dd>
					<ResourceBoundary
						resource={gitTreeEntry}
					>
						{#snippet children(entity)}
							{entity.mode}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>object ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									objectId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.objectId} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>object kind</dt>
				<dd>
					<ResourceBoundary
						resource={gitTreeEntry}
					>
						{#snippet children(entity)}
							{entity.objectKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$object}
			>
				{#snippet children(gitObject)}
					{#if gitObject != null}
						<div>
							<dt>object</dt>
							<dd>
								<GitObjectView
									selection={select(EntityType.GitObject, gitObject[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
