<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.CardanoStakePool_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoStakePool_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: cardanoStakePoolTimestamp })}
		<EntityView
			entityType={EntityType.CardanoStakePool_Timestamp}
			entitySelector={cardanoStakePoolTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				Cardano stake pool timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
