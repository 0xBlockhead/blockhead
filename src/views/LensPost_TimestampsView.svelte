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
	}: EntityListViewProps<EntityType.LensPost_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LensPost_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				$post: {
					fields: {
						text: true,
						timestamp: true,
					},
				},
				timestampMs: true,
			},
		})
	}
>
	{#snippet Item({ item: lensPostTimestamp })}
		{@const lensPostTimestampSelector = lensPostTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.LensPost_Timestamp}
			entitySelector={lensPostTimestampSelector}
			href={
				resolve(
					'/(social)/(lens)/lens/(lensNetwork)/post/[postId=stringSegment]/(lensPost)/observations/[timestampMs=nonNegativeInteger]',
					{
						postId: String(lensPostTimestampSelector.$post.id),
						timestampMs: String(lensPostTimestampSelector.timestampMs),
					}
				)
			}
		>
			{#snippet Title()}
				{[(lensPostTimestamp.$post.text ?? ''), lensPostTimestampSelector.$post.id].filter(Boolean).join(' ') || 'Lens post'}
			{/snippet}

			{#snippet Value()}
				{String(lensPostTimestampSelector.timestampMs)}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
