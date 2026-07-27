<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		typeAnnotationParagraphs = ['Reddit protocol catalog identity for public API and listing metadata. Product observeds live on the global Reddit hub.'],
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.RedditNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.RedditNetwork}
	bind:open
	{typeAnnotationParagraphs}
	resource={
		selection({
			fields: {
				protocolName: true,
			},
		})
	}
>
	{#snippet Item({ item: redditNetwork })}
		<EntityView
			entityType={EntityType.RedditNetwork}
			entitySelector={redditNetwork[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{redditNetwork.protocolName || 'Reddit network'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
