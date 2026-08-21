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
	}: EntityListViewProps<EntityType.AtprotoGraphList> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AtprotoGraphList}
	bind:open
	resource={
		selection({
			...{
				fields: {
					name: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: atprotoGraphList })}
		{@const atprotoGraphListSelector = atprotoGraphList[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AtprotoGraphList}
			entitySelector={atprotoGraphListSelector}
			href={
				resolve(
					'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/graph-list/[...uri=stringSegment]',
					{
						uri: encodeURIComponent(atprotoGraphListSelector.uri),
					}
				)
			}
		>
			{#snippet Title()}
				{atprotoGraphList.name || 'AT Protocol graph list'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
