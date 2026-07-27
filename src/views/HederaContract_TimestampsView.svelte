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
	}: EntityListViewProps<EntityType.HederaContract_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaContract_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaContractTimestamp })}
		<EntityView
			entityType={EntityType.HederaContract_Timestamp}
			entitySelector={hederaContractTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				hedera contract timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
