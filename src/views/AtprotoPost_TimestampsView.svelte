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
	}: EntityListViewProps<EntityType.AtprotoPost_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AtprotoPost_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				likeCount: true,
				replyCount: true,
			},
		})
	}
>
	{#snippet Item({ item: atprotoPostTimestamp })}
		{@const atprotoPostTimestampSelector = atprotoPostTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AtprotoPost_Timestamp}
			entitySelector={atprotoPostTimestampSelector}
			href={
				resolve(
					'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/post/[...uri=stringSegment]/(atprotoPost)/observations/[timestampMs=nonNegativeInteger]',
					{
						uri: encodeURIComponent(String(atprotoPostTimestampSelector.$post.uri)),
						timestampMs: String(atprotoPostTimestampSelector.timestampMs),
					}
				)
			}
		>
			{#snippet Title()}
				{String(atprotoPostTimestampSelector.timestampMs) || 'AT Protocol post observation'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(String(atprotoPostTimestamp.likeCount ?? '') ? String(atprotoPostTimestamp.likeCount ?? '') + ' likes' : ''), (String(atprotoPostTimestamp.replyCount ?? '') ? String(atprotoPostTimestamp.replyCount ?? '') + ' replies' : '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
