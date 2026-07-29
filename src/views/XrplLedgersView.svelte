<!-- Generated from APP.ts. Do not edit by hand. -->

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
	}: EntityListViewProps<EntityType.XrplLedger> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XrplLedger}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: xrplLedger })}
		{@const xrplLedgerSelector = xrplLedger[EntityMetaKey.Selector]}
		{@const network = xrplLedgerSelector.$network}
		<EntityView
			entityType={EntityType.XrplLedger}
			entitySelector={xrplLedgerSelector}
			href={
				'ledgerIndex' in xrplLedgerSelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/ledger/[ledgerIndex=nonNegativeBigInt]',
						{
							network: (
								'caip2' in network ?
									caip2StringFromValue(network.caip2)
								:
									network.slug
							),
							ledgerIndex: String(xrplLedgerSelector.ledgerIndex),
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				XRPL ledger
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
