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
	}: EntityListViewProps<EntityType.XrplTransaction_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XrplTransaction_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: xrplTransactionTimestamp })}
		{@const xrplTransactionTimestampSelector = xrplTransactionTimestamp[EntityMetaKey.Selector]}
		{@const transaction = xrplTransactionTimestampSelector.$transaction}
		<EntityView
			entityType={EntityType.XrplTransaction_Timestamp}
			entitySelector={xrplTransactionTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/transaction/xrpl/[hash=stringSegment]/(xrplTransaction)/observations/[ledgerIndex=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							'caip2' in transaction.$network ?
								caip2StringFromValue(transaction.$network.caip2)
							:
								transaction.$network.slug
						),
						hash: transaction.hash,
						ledgerIndex: String(xrplTransactionTimestampSelector.ledgerIndex),
						source: xrplTransactionTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				XRPL transaction timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
