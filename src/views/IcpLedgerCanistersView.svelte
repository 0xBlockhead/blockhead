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
	}: EntityListViewProps<EntityType.IcpLedgerCanister> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpLedgerCanister}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpLedgerCanister })}
		<EntityView
			entityType={EntityType.IcpLedgerCanister}
			entitySelector={icpLedgerCanister[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				ICP ledger canister
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
