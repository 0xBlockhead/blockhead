<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
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
			...{
				fields: {
					timestampMs: true,
					likeCount: true,
					replyCount: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: atprotoPostTimestamp })}
		{@const atprotoPostTimestampSelector = atprotoPostTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AtprotoPost_Timestamp}
			entitySelector={atprotoPostTimestampSelector}
		>
			{#snippet Title()}
				{atprotoPostTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(atprotoPostTimestamp.likeCount != null ? String(atprotoPostTimestamp.likeCount) + ' likes' : ''), (atprotoPostTimestamp.replyCount != null ? String(atprotoPostTimestamp.replyCount) + ' replies' : '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
