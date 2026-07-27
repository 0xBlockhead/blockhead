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
	}: EntityListViewProps<EntityType.UtxoOutput> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.UtxoOutput}
	bind:open
	resource={
		selection({
			fields: {
				indexInTransaction: true,
				$address: true,
				isSpent: true,
			},
		})
	}
>
	{#snippet Item({ item: utxoOutput })}
		{@const utxoOutputSelector = utxoOutput[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.UtxoOutput}
			entitySelector={utxoOutputSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/output/[outputIndex=nonNegativeInteger]',
					{
						network: (
							'caip2' in utxoOutputSelector.$transaction.$network ?
								String(caip2StringFromValue(utxoOutputSelector.$transaction.$network.caip2))
							:
								String(utxoOutputSelector.$transaction.$network.slug)
						),
						transactionId: String(utxoOutputSelector.$transaction.txId),
						outputIndex: String(utxoOutputSelector.indexInTransaction),
					}
				)
			}
		>
			{#snippet Title()}
				{(String(utxoOutputSelector.indexInTransaction ?? '') ? 'Output #' + String(utxoOutputSelector.indexInTransaction ?? '') : '') || 'UTXO output'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[utxoOutput.$address == null ? '' : utxoOutput.$address.address || 'UTXO address', String(utxoOutput.isSpent ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
