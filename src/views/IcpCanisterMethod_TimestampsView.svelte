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
	}: EntityListViewProps<EntityType.IcpCanisterMethod_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpCanisterMethod_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpCanisterMethodTimestamp })}
		<EntityView
			entityType={EntityType.IcpCanisterMethod_Timestamp}
			entitySelector={icpCanisterMethodTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				ICP canister method timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
