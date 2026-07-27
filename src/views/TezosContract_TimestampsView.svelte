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
	}: EntityListViewProps<EntityType.TezosContract_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosContract_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosContractTimestamp })}
		<EntityView
			entityType={EntityType.TezosContract_Timestamp}
			entitySelector={tezosContractTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				tezos contract timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
