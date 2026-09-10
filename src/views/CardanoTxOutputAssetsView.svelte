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
	}: EntityListViewProps<EntityType.CardanoTxOutputAsset> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoTxOutputAsset}
	bind:open
	resource={
		selection({
			fields: {
				$asset: {
					fields: {
						fingerprint: true,
					},
				},
				quantity: true,
			},
		})
	}
>
	{#snippet Item({ item: cardanoTxOutputAsset })}
		{@const cardanoTxOutputAssetSelector = cardanoTxOutputAsset[EntityMetaKey.Selector]}
		{@const output = cardanoTxOutputAssetSelector.$output}
		{@const asset = cardanoTxOutputAssetSelector.$asset}
		<EntityView
			entityType={EntityType.CardanoTxOutputAsset}
			entitySelector={cardanoTxOutputAssetSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/output/[outputIndex=nonNegativeInteger]/(selection)/asset/[policyId=stringSegment]/[assetName=stringSegment]',
					{
						network: (
							'caip2' in output.$transaction.$network ?
								caip2StringFromValue(output.$transaction.$network.caip2)
							:
								output.$transaction.$network.slug
						),
						transactionId: output.$transaction.hash,
						outputIndex: String(output.outputIndex),
						policyId: asset.policyId,
						assetName: asset.assetName,
					}
				)
			}
		>
			{#snippet Title()}
				{cardanoTxOutputAssetSelector.$asset.assetName || cardanoTxOutputAssetSelector.$asset.policyId || 'Cardano native asset'}
			{/snippet}

			{#snippet Value()}
				{cardanoTxOutputAsset.quantity}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
