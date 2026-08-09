<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.StellarLedger> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarLedger}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: stellarLedger })}
		{@const stellarLedgerSelector = stellarLedger[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.StellarLedger}
			entitySelector={stellarLedgerSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/ledger/stellar/[sequence=nonNegativeBigInt]',
					{
						network: (
							'caip2' in stellarLedgerSelector.$network.$network ?
								caip2StringFromValue(stellarLedgerSelector.$network.$network.caip2)
							:
								stellarLedgerSelector.$network.$network.slug
						),
						sequence: String(stellarLedgerSelector.sequence),
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
