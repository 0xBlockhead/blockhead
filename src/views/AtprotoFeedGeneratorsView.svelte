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
	}: EntityListViewProps<EntityType.AtprotoFeedGenerator> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AtprotoFeedGenerator}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$avatar: true,
					displayName: true,
					uri: true,
					isOnline: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: atprotoFeedGenerator })}
		{@const atprotoFeedGeneratorSelector = atprotoFeedGenerator[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AtprotoFeedGenerator}
			entitySelector={atprotoFeedGeneratorSelector}
			href={
				resolve(
					'/(social)/(atproto)/atproto/(globalAtprotoNetwork)/feed/[...uri=stringSegment]',
					{
						uri: encodeURIComponent(atprotoFeedGeneratorSelector.uri),
					}
				)
			}
		>
			{#snippet Title()}
				{atprotoFeedGenerator.displayName || atprotoFeedGeneratorSelector.uri || 'AT Protocol feed generator'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{atprotoFeedGenerator.isOnline}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
