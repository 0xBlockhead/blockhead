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
	}: EntityListViewProps<EntityType.XPost> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XPost}
	bind:open
	resource={
		selection({
			fields: {
				text: true,
				id: true,
				createdAt: true,
			},
		})
	}
>
	{#snippet Item({ item: xPost })}
		{@const xPostSelector = xPost[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.XPost}
			entitySelector={xPostSelector}
			href={
				resolve(
					'/(social)/(x)/x/(xNetwork)/post/[postId=stringSegment]',
					{
						postId: xPostSelector.id,
					}
				)
			}
		>
			{#snippet Title()}
				{[(xPost.text ?? ''), xPostSelector.id].filter(Boolean).join(' ') || 'X post'}
			{/snippet}

			{#snippet Value()}
				{xPostSelector.id}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{xPost.createdAt ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
