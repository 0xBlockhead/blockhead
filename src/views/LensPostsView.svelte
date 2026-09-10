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
	}: EntityListViewProps<EntityType.LensPost> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.LensPost}
	bind:open
	resource={
		selection({
			fields: {
				text: true,
				id: true,
				timestamp: true,
			},
		})
	}
>
	{#snippet Item({ item: lensPost })}
		{@const lensPostSelector = lensPost[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.LensPost}
			entitySelector={lensPostSelector}
			href={
				resolve(
					'/(social)/(lens)/lens/(lensNetwork)/post/[postId=stringSegment]',
					{
						postId: lensPostSelector.id,
					}
				)
			}
		>
			{#snippet Title()}
				{[(lensPost.text ?? ''), lensPostSelector.id].filter(Boolean).join(' ') || 'Lens post'}
			{/snippet}

			{#snippet Value()}
				{[String(lensPost.timestamp ?? ''), lensPostSelector.id].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
