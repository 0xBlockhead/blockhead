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
		id = 'XrplLedgerEntries-list',
		...EntitiesListProps
	}: EntityListViewProps<EntityType.XrplLedgerEntry> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XrplLedgerEntry}
	{id}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: xrplLedgerEntry })}
		<EntityView
			entityType={EntityType.XrplLedgerEntry}
			entitySelector={xrplLedgerEntry[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				XRPL ledger entry
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
