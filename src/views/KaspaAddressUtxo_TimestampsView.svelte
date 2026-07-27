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
	}: EntityListViewProps<EntityType.KaspaAddressUtxo_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.KaspaAddressUtxo_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: kaspaAddressUtxoTimestamp })}
		<EntityView
			entityType={EntityType.KaspaAddressUtxo_Timestamp}
			entitySelector={kaspaAddressUtxoTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				kaspa address UTXO timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
