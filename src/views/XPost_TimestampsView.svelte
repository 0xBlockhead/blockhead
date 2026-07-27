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
	}: EntityListViewProps<EntityType.XPost_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XPost_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$post: {
					fields: {
						text: true,
						createdAt: true,
					},
				},
				timestampMs: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: xPostTimestamp })}
		{@const xPostTimestampSelector = xPostTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.XPost_Timestamp}
			entitySelector={xPostTimestampSelector}
			href={
				resolve(
					'/(social)/(x)/x/(xNetwork)/post/[postId=stringSegment]/(xPost)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						postId: String(xPostTimestampSelector.$post.id),
						timestampMs: String(xPostTimestampSelector.timestampMs),
						source: String(xPostTimestampSelector.source),
					}
				)
			}
		>
			{#snippet Title()}
				{[(xPostTimestamp.$post.text ?? ''), xPostTimestampSelector.$post.id].filter(Boolean).join(' ') || 'X post'}
			{/snippet}

			{#snippet Value()}
				{String(xPostTimestampSelector.timestampMs)}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{xPostTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
