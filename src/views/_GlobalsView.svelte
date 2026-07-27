<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		typeAnnotationParagraphs = ['Root catalog and navigation scope for top-level networks, assets, markets, proposals, and local Blockhead state.'],
		open = $bindable(true),
		id = 'Globals-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType._Global> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType._Global}
	{id}
	bind:open
	{typeAnnotationParagraphs}
	resource={selection()}
>
	{#snippet Item({ item: global })}
		<EntityView
			entityType={EntityType._Global}
			entitySelector={global[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				global
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
