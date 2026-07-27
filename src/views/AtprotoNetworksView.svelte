<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		typeAnnotationParagraphs = ['AT Protocol catalog identity for DID, repository, PDS, and appview protocol metadata. Product observeds live on the global AT Protocol hub.'],
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.AtprotoNetwork> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AtprotoNetwork}
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
	{#snippet Item({ item: atprotoNetwork })}
		<EntityView
			entityType={EntityType.AtprotoNetwork}
			entitySelector={atprotoNetwork[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{atprotoNetwork.protocolName || 'AT Protocol'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
