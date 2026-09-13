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
	}: EntityListViewProps<EntityType.TronTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TronTransaction}
	bind:open
	resource={
		selection({
			fields: {
				transactionId: true,
				result: true,
				$owner: true,
				$to: true,
			},
		})
	}
>
	{#snippet Item({ item: tronTransaction })}
		{@const tronTransactionSelector = tronTransaction[EntityMetaKey.Selector]}
		{@const network = tronTransactionSelector.$network}
		<EntityView
			entityType={EntityType.TronTransaction}
			entitySelector={tronTransactionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						transactionId: tronTransactionSelector.transactionId,
					}
				)
			}
		>
			{#snippet Title()}
				{tronTransactionSelector.transactionId || 'tron transaction'}
			{/snippet}

			{#snippet Value()}
				{tronTransaction.result ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[tronTransaction.$owner == null ? '' : tronTransaction.$owner.address || 'tron account', tronTransaction.$to == null ? '' : tronTransaction.$to.address || 'tron account'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
