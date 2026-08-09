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
	}: EntityListViewProps<EntityType.HyperliquidTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidTransaction}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidTransaction })}
		{@const hyperliquidTransactionSelector = hyperliquidTransaction[EntityMetaKey.Selector]}
		{@const network = hyperliquidTransactionSelector.$network}
		<EntityView
			entityType={EntityType.HyperliquidTransaction}
			entitySelector={hyperliquidTransactionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						transactionId: hyperliquidTransactionSelector.txHash,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
