<!-- Generated from APP.ts. -->

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
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadPanelTree>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadPanelsView from '$/views/BlockheadPanelsView.svelte'
	import BlockheadWorkspaceView from '$/views/BlockheadWorkspaceView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadPanelTree}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.id || 'dashboard')}
	href={
		href === undefined ?
			resolve(
				'/~/dashboard/[dashboardId=stringSegment]',
				{
					dashboardId: selection.entitySelector.id,
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
		<TruncatedValue value={selection.entitySelector.id} />
	{/snippet}

	{#snippet Value()}
		Dashboard
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					{selection.entitySelector.id}
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
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const panelsResource = selection.$$panels}
		<ResourceBoundary
			resource={panelsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadPanelsView
						selection={panelsResource}
						countResource={panelsResource.count}
						title='panels'
						id='panels'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
