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
	}: EntityListViewProps<EntityType.XrplAmm_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XrplAmm_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: xrplAmmTimestamp })}
		<EntityView
			entityType={EntityType.XrplAmm_Timestamp}
			entitySelector={xrplAmmTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				XRPL AMM timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
