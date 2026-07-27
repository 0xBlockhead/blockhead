<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
	}: EntitySelectionViewProps<EntityType.GitTreeEntry> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const gitTreeEntry = $derived(selection({
		fields: {
			objectKind: true,
			mode: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.path ?? '') || 'Git tree entry')


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
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.path ?? '') || 'Git tree entry'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={gitTreeEntry}>
			{#snippet children(entity)}
				{entity.objectKind || pendingEntity.path || titleFallback}
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

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>tree</dt>
				<dd>
					<GitTreeView
						selection={select(EntityType.GitTree, selection.entitySelector.$tree)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>path</dt>
				<dd>
					{pendingEntity.path}
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
							<TruncatedValue value={String(entity.objectId)} />
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
									prefetched={gitObject}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
