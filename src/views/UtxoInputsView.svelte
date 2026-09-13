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
		{@const transaction = utxoInputSelector.$transaction}
		<EntityView
			entityType={EntityType.UtxoInput}
			entitySelector={utxoInputSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/input/[inputIndex=nonNegativeInteger]',
					{
						network: (
							transaction.$network.caip2 !== undefined ?
								caip2StringFromValue(transaction.$network.caip2)
							:
								transaction.$network.slug
						),
						transactionId: transaction.txId,
						inputIndex: String(utxoInputSelector.indexInTransaction),
					}
				)
			}
		>
			{#snippet Title()}
				{`Input #${utxoInputSelector.indexInTransaction}`}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{utxoInput.$spentOutput == null ? '' : `Output #${utxoInput.$spentOutput.indexInTransaction}`}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
