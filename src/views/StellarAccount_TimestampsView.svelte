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
	}: EntityListViewProps<EntityType.StellarAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarAccount_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: stellarAccountTimestamp })}
		<EntityView
			entityType={EntityType.StellarAccount_Timestamp}
			entitySelector={stellarAccountTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				stellar account timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
