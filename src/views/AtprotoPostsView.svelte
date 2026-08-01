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
	}: EntityListViewProps<EntityType.AtprotoPost> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AtprotoPost}
	bind:open
	resource={
		selection({
			fields: {
				text: true,
				uri: true,
				createdAt: true,
			},
			limit: 25,
		})
	}
>
	{#snippet Item({ item: atprotoPost })}
		{@const atprotoPostSelector = atprotoPost[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AtprotoPost}
			entitySelector={atprotoPostSelector}
			href={
				resolve(
					'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/post/[...uri=stringSegment]',
					{
						uri: encodeURIComponent(atprotoPostSelector.uri),
					}
				)
			}
		>
			{#snippet Title()}
				{(atprotoPost.text ?? '') || atprotoPostSelector.uri || 'AT Protocol post'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{atprotoPost.createdAt ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
