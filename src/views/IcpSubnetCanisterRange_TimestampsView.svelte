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
	}: EntityListViewProps<EntityType.IcpSubnetCanisterRange_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpSubnetCanisterRange_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpSubnetCanisterRangeTimestamp })}
		<EntityView
			entityType={EntityType.IcpSubnetCanisterRange_Timestamp}
			entitySelector={icpSubnetCanisterRangeTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				ICP subnet canister range timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
