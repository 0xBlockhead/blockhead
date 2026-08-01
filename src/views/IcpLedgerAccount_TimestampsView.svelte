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
	}: EntityListViewProps<EntityType.IcpLedgerAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpLedgerAccount_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpLedgerAccountTimestamp })}
		<EntityView
			entityType={EntityType.IcpLedgerAccount_Timestamp}
			entitySelector={icpLedgerAccountTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				ICP ledger account timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
