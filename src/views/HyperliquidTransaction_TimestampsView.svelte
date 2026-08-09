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
	}: EntityListViewProps<EntityType.HyperliquidTransaction_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidTransaction_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidTransactionTimestamp })}
		{@const hyperliquidTransactionTimestampSelector = hyperliquidTransactionTimestamp[EntityMetaKey.Selector]}
		{@const transaction = hyperliquidTransactionTimestampSelector.$transaction}
		<EntityView
			entityType={EntityType.HyperliquidTransaction_Timestamp}
			entitySelector={hyperliquidTransactionTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in transaction.$network ?
								caip2StringFromValue(transaction.$network.caip2)
							:
								transaction.$network.slug
						),
						transactionId: transaction.txHash,
						timestampMs: String(hyperliquidTransactionTimestampSelector.timestampMs),
						source: hyperliquidTransactionTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
