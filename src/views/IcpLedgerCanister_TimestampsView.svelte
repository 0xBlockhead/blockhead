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
	}: EntityListViewProps<EntityType.IcpLedgerCanister_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpLedgerCanister_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpLedgerCanisterTimestamp })}
		<EntityView
			entityType={EntityType.IcpLedgerCanister_Timestamp}
			entitySelector={icpLedgerCanisterTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				ICP ledger canister timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
