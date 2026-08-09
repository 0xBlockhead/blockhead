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
	}: EntityListViewProps<EntityType.TronTransactionReceipt> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TronTransactionReceipt}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tronTransactionReceipt })}
		{@const tronTransactionReceiptSelector = tronTransactionReceipt[EntityMetaKey.Selector]}
		{@const transaction = tronTransactionReceiptSelector.$transaction}
		<EntityView
			entityType={EntityType.TronTransactionReceipt}
			entitySelector={tronTransactionReceiptSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/receipt',
					{
						network: (
							'caip2' in transaction.$network ?
								caip2StringFromValue(transaction.$network.caip2)
							:
								transaction.$network.slug
						),
						transactionId: transaction.transactionId,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
