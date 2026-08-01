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
	}: EntityListViewProps<EntityType.AtprotoActor_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AtprotoActor_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				followersCount: true,
				postsCount: true,
			},
		})
	}
>
	{#snippet Item({ item: atprotoActorTimestamp })}
		{@const atprotoActorTimestampSelector = atprotoActorTimestamp[EntityMetaKey.Selector]}
		{@const actor = atprotoActorTimestampSelector.$actor}
		<EntityView
			entityType={EntityType.AtprotoActor_Timestamp}
			entitySelector={atprotoActorTimestampSelector}
			href={
				'did' in actor ?
					resolve(
						'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]/(atprotoActor)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							did: encodeURIComponent(actor.did),
							timestampMs: String(atprotoActorTimestampSelector.timestampMs),
							source: atprotoActorTimestampSelector.source,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{atprotoActorTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(atprotoActorTimestamp.followersCount != null ? String(atprotoActorTimestamp.followersCount) + ' followers' : ''), (atprotoActorTimestamp.postsCount != null ? String(atprotoActorTimestamp.postsCount) + ' posts' : '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
