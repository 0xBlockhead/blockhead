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
		limit = 12,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<
		EntityType.AtprotoActor,
		{
			limit?: number
		}
	> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AtprotoActor}
	bind:open
	resource={
		selection({
			...{
				fields: {
					did: true,
				},
			},
			limit: limit,
		})
	}
>
	{#snippet Item({ item: atprotoActor })}
		<EntityView
			entityType={EntityType.AtprotoActor}
			entitySelector={atprotoActor[EntityMetaKey.Selector]}
			href={
				resolve(
					'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]',
					{
						did: encodeURIComponent(atprotoActor.did),
					}
				)
			}
		>
			{#snippet Title()}
				{atprotoActor.did || 'AT Protocol account'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
