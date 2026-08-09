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
	}: EntityListViewProps<EntityType.MoneroTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.MoneroTransaction}
	bind:open
	resource={
		selection({
			...{
				fields: {
					txHash: true,
					$block: true,
					feeAtomicUnits: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: moneroTransaction })}
		{@const moneroTransactionSelector = moneroTransaction[EntityMetaKey.Selector]}
		{@const network = moneroTransactionSelector.$network}
		<EntityView
			entityType={EntityType.MoneroTransaction}
			entitySelector={moneroTransactionSelector}
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
						transactionId: moneroTransactionSelector.txHash,
					}
				)
			}
		>
			{#snippet Title()}
				{moneroTransactionSelector.txHash || 'monero transaction'}
			{/snippet}

			{#snippet Value()}
				{moneroTransaction.$block == null ? '' : String(moneroTransaction.$block.height) || 'monero block'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{moneroTransaction.feeAtomicUnits ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
