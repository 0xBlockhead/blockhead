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
	}: EntityListViewProps<EntityType.IcpLedgerTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpLedgerTransaction}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpLedgerTransaction })}
		<EntityView
			entityType={EntityType.IcpLedgerTransaction}
			entitySelector={icpLedgerTransaction[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				ICP ledger transaction
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
