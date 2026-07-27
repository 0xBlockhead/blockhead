<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: EntitySelectionViewProps<EntityType.BlockheadPanelTree> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = $derived((pendingEntity.id ?? '') || 'dashboard')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadPanelsView from '$/views/BlockheadPanelsView.svelte'
	import BlockheadWorkspaceView from '$/views/BlockheadWorkspaceView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadPanelTree}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/~/dashboard/[dashboardId=stringSegment]',
			{
				dashboardId: String(selection.entitySelector.id),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={pendingEntity.id} />
	{/snippet}

	{#snippet Value()}
		Dashboard
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					{pendingEntity.id}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$workspace}
			>
				{#snippet children(blockheadWorkspace)}
					{#if blockheadWorkspace != null}
						<div>
							<dt>workspace</dt>
							<dd>
								<BlockheadWorkspaceView
									selection={select(EntityType.BlockheadWorkspace, blockheadWorkspace[EntityMetaKey.Selector])}
									prefetched={blockheadWorkspace}
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

	{#snippet Details({ open: detailsOpen })}
		{@const blockheadPanelTreeBlockheadPanelsViewPanelsResource = selection.$$panels}
		<ResourceBoundary
			resource={blockheadPanelTreeBlockheadPanelsViewPanelsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadPanelsView
						selection={blockheadPanelTreeBlockheadPanelsViewPanelsResource}
						countResource={blockheadPanelTreeBlockheadPanelsViewPanelsResource.count}
						title='panels'
						id='panels'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
