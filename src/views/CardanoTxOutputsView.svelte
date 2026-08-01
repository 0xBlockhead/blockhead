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
	}: EntityListViewProps<EntityType.CardanoTxOutput> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoTxOutput}
	bind:open
	resource={
		selection({
			fields: {
				outputIndex: true,
				lovelace: true,
				address: true,
			},
		})
	}
>
	{#snippet Item({ item: cardanoTxOutput })}
		{@const cardanoTxOutputSelector = cardanoTxOutput[EntityMetaKey.Selector]}
		{@const transaction = cardanoTxOutputSelector.$transaction}
		<EntityView
			entityType={EntityType.CardanoTxOutput}
			entitySelector={cardanoTxOutputSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/output/[outputIndex=nonNegativeInteger]',
					{
						network: (
							'caip2' in transaction.$network ?
								caip2StringFromValue(transaction.$network.caip2)
							:
								transaction.$network.slug
						),
						transactionId: transaction.hash,
						outputIndex: String(cardanoTxOutputSelector.outputIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{cardanoTxOutputSelector.outputIndex}
			{/snippet}

			{#snippet Value()}
				{cardanoTxOutput.lovelace ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cardanoTxOutput.address ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
