<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.BlockheadPanel> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadPanel = $derived(viewSelection({
		fields: {
			indexInParent: true,
			kind: true,
			entityType: true,
		},
	}))
	const titleFallback = $derived((prefetched.kind ?? '') || 'panel')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BlockheadPanelTreeView from '$/views/BlockheadPanelTreeView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadPanel}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadPanel}>
			{#snippet children(entity)}
				{entity.kind || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadPanel}>
			{#snippet children(entity)}
				{(entity.entityType ?? '') || entity.kind || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadPanel}>
			{#snippet children(entity)}
				<span data-text="muted">
					<NumberValue
						value={entity.indexInParent}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>tree ID</dt>
				<dd>
					{selection.entitySelector.treeId}
				</dd>
			</div>

			<div>
				<dt>panel ID</dt>
				<dd>
					{selection.entitySelector.panelId}
				</dd>
			</div>

			<div>
				<dt>panel tree</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$panelTree}
					>
						{#snippet children(blockheadPanelTree)}
							<BlockheadPanelTreeView
								selection={select(EntityType.BlockheadPanelTree, blockheadPanelTree[EntityMetaKey.Selector])}
								prefetched={blockheadPanelTree}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							parentPanelId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const parentPanelId = entity.parentPanelId}
					{#if parentPanelId != null}
						<div>
							<dt>parent panel ID</dt>
							<dd>
								{parentPanelId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>index in parent</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadPanel}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.indexInParent}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>kind</dt>
				<dd>
					<ResourceBoundary
						resource={blockheadPanel}
					>
						{#snippet children(entity)}
							{entity.kind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadPanel}
			>
				{#snippet children(entity)}
					{@const entityType = entity.entityType}
					{#if entityType != null}
						<div>
							<dt>entity type</dt>
							<dd>
								{entityType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
