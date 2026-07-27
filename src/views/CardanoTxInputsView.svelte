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
		<EntityView
			entityType={EntityType.CardanoTxInput}
			entitySelector={cardanoTxInputSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/input/[inputIndex=nonNegativeInteger]',
					{
						network: (
							'caip2' in cardanoTxInputSelector.$transaction.$network ?
								String(caip2StringFromValue(cardanoTxInputSelector.$transaction.$network.caip2))
							:
								String(cardanoTxInputSelector.$transaction.$network.slug)
						),
						transactionId: String(cardanoTxInputSelector.$transaction.hash),
						inputIndex: String(cardanoTxInputSelector.inputIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{(String(cardanoTxInputSelector.inputIndex) ? 'Input ' + String(cardanoTxInputSelector.inputIndex) : '') || 'Cardano transaction input'}
			{/snippet}

			{#snippet Value()}
				{(cardanoTxInput.inputKind ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(cardanoTxInput.spentTxHash ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
