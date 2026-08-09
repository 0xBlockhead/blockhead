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
	}: EntityListViewProps<EntityType.StellarTransaction_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarTransaction_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: stellarTransactionTimestamp })}
		{@const stellarTransactionTimestampSelector = stellarTransactionTimestamp[EntityMetaKey.Selector]}
		{@const transaction = stellarTransactionTimestampSelector.$transaction}
		<EntityView
			entityType={EntityType.StellarTransaction_Timestamp}
			entitySelector={stellarTransactionTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/transaction/stellar/[hash=stringSegment]/(stellarTransaction)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in transaction.$network.$network ?
								caip2StringFromValue(transaction.$network.$network.caip2)
							:
								transaction.$network.$network.slug
						),
						hash: transaction.hash,
						timestampMs: String(stellarTransactionTimestampSelector.timestampMs),
						source: stellarTransactionTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
