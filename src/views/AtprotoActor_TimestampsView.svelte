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
		<EntityView
			entityType={EntityType.AtprotoActor_Timestamp}
			entitySelector={atprotoActorTimestampSelector}
			href={
				(
					'did' in atprotoActorTimestampSelector.$actor ?
						resolve(
							'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/actor/[did=stringSegment]/(atprotoActor)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
							{
								did: encodeURIComponent(String(atprotoActorTimestampSelector.$actor.did)),
								timestampMs: String(atprotoActorTimestampSelector.timestampMs),
								source: String(atprotoActorTimestampSelector.source),
							}
						)
					:
						undefined
				)
			}
		>
			{#snippet Title()}
				{String(atprotoActorTimestampSelector.timestampMs) || 'AT Protocol account observation'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(String(atprotoActorTimestamp.followersCount ?? '') ? String(atprotoActorTimestamp.followersCount ?? '') + ' followers' : ''), (String(atprotoActorTimestamp.postsCount ?? '') ? String(atprotoActorTimestamp.postsCount ?? '') + ' posts' : '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
