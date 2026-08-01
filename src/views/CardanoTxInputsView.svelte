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
	}: EntityListViewProps<EntityType.CardanoTxInput> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoTxInput}
	bind:open
	resource={
		selection({
			fields: {
				inputIndex: true,
				inputKind: true,
				spentTxHash: true,
			},
		})
	}
>
	{#snippet Item({ item: cardanoTxInput })}
		{@const cardanoTxInputSelector = cardanoTxInput[EntityMetaKey.Selector]}
		{@const transaction = cardanoTxInputSelector.$transaction}
		<EntityView
			entityType={EntityType.CardanoTxInput}
			entitySelector={cardanoTxInputSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/input/[inputIndex=nonNegativeInteger]',
					{
						network: (
							'caip2' in transaction.$network ?
								caip2StringFromValue(transaction.$network.caip2)
							:
								transaction.$network.slug
						),
						transactionId: transaction.hash,
						inputIndex: String(cardanoTxInputSelector.inputIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{'Input ' + cardanoTxInputSelector.inputIndex}
			{/snippet}

			{#snippet Value()}
				{cardanoTxInput.inputKind ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cardanoTxInput.spentTxHash ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
