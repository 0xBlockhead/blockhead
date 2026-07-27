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
	}: EntityListViewProps<EntityType.IcpLedgerBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpLedgerBlock}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpLedgerBlock })}
		<EntityView
			entityType={EntityType.IcpLedgerBlock}
			entitySelector={icpLedgerBlock[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				ICP ledger block
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
