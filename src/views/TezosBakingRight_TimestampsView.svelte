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
	}: EntityListViewProps<EntityType.TezosBakingRight_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosBakingRight_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosBakingRightTimestamp })}
		<EntityView
			entityType={EntityType.TezosBakingRight_Timestamp}
			entitySelector={tezosBakingRightTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				tezos baking right timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
