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
	}: EntityListViewProps<EntityType.UtxoInput> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.UtxoInput}
	bind:open
	resource={
		selection({
			fields: {
				indexInTransaction: true,
				$spentOutput: true,
			},
		})
	}
>
	{#snippet Item({ item: utxoInput })}
		{@const utxoInputSelector = utxoInput[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.UtxoInput}
			entitySelector={utxoInputSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/input/[inputIndex=nonNegativeInteger]',
					{
						network: (
							'caip2' in utxoInputSelector.$transaction.$network ?
								String(caip2StringFromValue(utxoInputSelector.$transaction.$network.caip2))
							:
								String(utxoInputSelector.$transaction.$network.slug)
						),
						transactionId: String(utxoInputSelector.$transaction.txId),
						inputIndex: String(utxoInputSelector.indexInTransaction),
					}
				)
			}
		>
			{#snippet Title()}
				{(String(utxoInputSelector.indexInTransaction ?? '') ? 'Input #' + String(utxoInputSelector.indexInTransaction ?? '') : '') || 'UTXO input'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{utxoInput.$spentOutput == null ? '' : (String(utxoInput.$spentOutput.indexInTransaction ?? '') ? 'Output #' + String(utxoInput.$spentOutput.indexInTransaction ?? '') : '') || 'UTXO output'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
