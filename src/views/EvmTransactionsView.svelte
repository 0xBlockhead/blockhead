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
	}: EntityListViewProps<EntityType.EvmTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmTransaction}
	bind:open
	resource={
		selection({
			fields: {
				txHash: true,
			},
		})
	}
>
	{#snippet Item({ item: evmTransaction })}
		{@const evmTransactionSelector = evmTransaction[EntityMetaKey.Selector]}
		{@const network = evmTransactionSelector.$network}
		<EntityView
			entityType={EntityType.EvmTransaction}
			entitySelector={evmTransactionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						transactionId: evmTransactionSelector.txHash,
					}
				)
			}
		>
			{#snippet Title()}
				{evmTransactionSelector.txHash || 'EVM transaction'}
			{/snippet}

			{#snippet Value()}
				{evmTransactionSelector.txHash}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
