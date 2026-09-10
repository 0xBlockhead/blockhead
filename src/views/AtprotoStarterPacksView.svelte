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
	}: EntityListViewProps<EntityType.AtprotoStarterPack> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AtprotoStarterPack}
	bind:open
	resource={
		selection({
			fields: {
				uri: true,
			},
		})
	}
>
	{#snippet Item({ item: atprotoStarterPack })}
		{@const atprotoStarterPackSelector = atprotoStarterPack[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AtprotoStarterPack}
			entitySelector={atprotoStarterPackSelector}
			href={
				resolve(
					'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/starter-pack/[...uri=stringSegment]',
					{
						uri: encodeURIComponent(atprotoStarterPackSelector.uri),
					}
				)
			}
		>
			{#snippet Title()}
				{atprotoStarterPackSelector.uri || 'AT Protocol starter pack'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
