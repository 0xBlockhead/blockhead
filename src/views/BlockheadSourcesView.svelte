<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadSource> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadSource}
	bind:open
	resource={
		selection({
			...{
				sources: selection.sources ?? [
					Source.Constants_Internal,
					Source.Local_Internal,
				],
				fields: {
					label: true,
					source: true,
					id: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadSource })}
		{@const blockheadSourceSelector = blockheadSource[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadSource}
			entitySelector={blockheadSourceSelector}
			href={
				resolve(
					'/~/manage/source/[sourceId=stringSegment]',
					{
						sourceId: blockheadSourceSelector.id,
					}
				)
			}
		>
			{#snippet Title()}
				{(blockheadSource.label ?? '') || blockheadSourceSelector.id || 'source'}
			{/snippet}

			{#snippet Value()}
				{blockheadSource.source ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
