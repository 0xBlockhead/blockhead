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
	}: EntityListViewProps<EntityType.IcpCanisterLog_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpCanisterLog_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpCanisterLogTimestamp })}
		<EntityView
			entityType={EntityType.IcpCanisterLog_Timestamp}
			entitySelector={icpCanisterLogTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				ICP canister log timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
