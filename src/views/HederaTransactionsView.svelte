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
	}: EntityListViewProps<EntityType.HederaTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaTransaction}
	bind:open
	resource={
		selection({
			fields: {
				transactionType: true,
				result: true,
				transactionId: true,
				consensusTimestamp: true,
			},
		})
	}
>
	{#snippet Item({ item: hederaTransaction })}
		{@const hederaTransactionSelector = hederaTransaction[EntityMetaKey.Selector]}
		{@const network = hederaTransactionSelector.$network}
		<EntityView
			entityType={EntityType.HederaTransaction}
			entitySelector={hederaTransactionSelector}
			href={
				hederaTransactionSelector.transactionId !== undefined
				&& hederaTransactionSelector.nonce !== undefined ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/nonce/[nonce=nonNegativeInteger]',
						{
							network: (
								network.caip2 !== undefined ?
									caip2StringFromValue(network.caip2)
								:
									network.slug
							),
							transactionId: hederaTransactionSelector.transactionId,
							nonce: String(hederaTransactionSelector.nonce),
						}
					)
				:
					hederaTransactionSelector.consensusTimestamp !== undefined ?
						resolve(
							'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/consensus/[consensusTimestamp=stringSegment]',
							{
								network: (
									network.caip2 !== undefined ?
										caip2StringFromValue(network.caip2)
									:
										network.slug
								),
								consensusTimestamp: hederaTransactionSelector.consensusTimestamp,
							}
						)
					:
						undefined
			}
		>
			{#snippet Title()}
				{hederaTransaction.transactionType || hederaTransaction.transactionId || 'hedera transaction'}
			{/snippet}

			{#snippet Value()}
				{hederaTransaction.result ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{hederaTransaction.consensusTimestamp}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
