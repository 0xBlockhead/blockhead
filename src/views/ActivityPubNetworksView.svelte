<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		typeAnnotationParagraphs = ['ActivityPub is the W3C federation protocol. This hub shows bounded Mastodon-compatible actor and note windows from declared instance sources.'],
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.ActivityPubNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ActivityPubNetwork}
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
	{#snippet Item({ item: activityPubNetwork })}
		<EntityView
			entityType={EntityType.ActivityPubNetwork}
			entitySelector={activityPubNetwork[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{activityPubNetwork.protocolName || 'ActivityPub'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
