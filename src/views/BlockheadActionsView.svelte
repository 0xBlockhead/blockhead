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
		title = 'Actions',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadAction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadAction}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					contentRevisionHash: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadAction })}
		{@const blockheadActionSelector = blockheadAction[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadAction}
			entitySelector={blockheadActionSelector}
			href={
				resolve(
					'/~/action/[actionId=stringSegment]',
					{
						actionId: blockheadActionSelector.id,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadAction.contentRevisionHash || 'blockhead action'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
