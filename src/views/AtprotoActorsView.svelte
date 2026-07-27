<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		typeAnnotationParagraphs = ['An AT Protocol actor is a DID-addressed repository identity. Handles, display names, avatars, banners, and counts are mutable appview observations over that identity.'],
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.AtprotoActor> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AtprotoActor}
	bind:open
	{typeAnnotationParagraphs}
	resource={
		selection({
			fields: {
				did: true,
			},
			limit: 12,
		})
	}
>
	{#snippet Item({ item: atprotoActor })}
		{@const atprotoActorSelector = atprotoActor[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AtprotoActor}
			entitySelector={atprotoActorSelector}
			href={
				resolve(
					'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]',
					{
						did: encodeURIComponent(String(atprotoActor.did)),
					}
				)
			}
		>
			{#snippet Title()}
				{atprotoActorSelector.did || 'AT Protocol account'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
