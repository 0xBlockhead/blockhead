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
	}: EntityListViewProps<EntityType.IcpCanister_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpCanister_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpCanisterTimestamp })}
		<EntityView
			entityType={EntityType.IcpCanister_Timestamp}
			entitySelector={icpCanisterTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				ICP canister timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
