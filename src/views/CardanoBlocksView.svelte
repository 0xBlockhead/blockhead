<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntityListViewProps<EntityType.CardanoBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoBlock}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: cardanoBlock })}
		<EntityView
			entityType={EntityType.CardanoBlock}
			entitySelector={cardanoBlock[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				Cardano block
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
