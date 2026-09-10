<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadPanel> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadPanel}
	bind:open
	resource={
		selection({
			fields: {
				kind: true,
				entityType: true,
				indexInParent: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadPanel })}
		{@const blockheadPanelSelector = blockheadPanel[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadPanel}
			entitySelector={blockheadPanelSelector}
			href={
				resolve(
					'/~/panel-tree/[treeId=stringSegment]/panel/[panelId=stringSegment]',
					{
						treeId: blockheadPanelSelector.treeId,
						panelId: blockheadPanelSelector.panelId,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadPanel.kind || 'panel'}
			{/snippet}

			{#snippet Value()}
				{blockheadPanel.entityType ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadPanel.indexInParent}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
