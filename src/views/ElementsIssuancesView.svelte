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
	}: EntityListViewProps<EntityType.ElementsIssuance> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ElementsIssuance}
	bind:open
	resource={
		selection({
			fields: {
				inputIndex: true,
				$asset: true,
				$reissuanceTokenAsset: true,
				isReissuance: true,
			},
		})
	}
>
	{#snippet Item({ item: elementsIssuance })}
		{@const elementsIssuanceSelector = elementsIssuance[EntityMetaKey.Selector]}
		{@const transaction = elementsIssuanceSelector.$transaction}
		<EntityView
			entityType={EntityType.ElementsIssuance}
			entitySelector={elementsIssuanceSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/issuance/[inputIndex=nonNegativeInteger]',
					{
						network: (
							'caip2' in transaction.$network ?
								caip2StringFromValue(transaction.$network.caip2)
							:
								transaction.$network.slug
						),
						transactionId: transaction.txId,
						inputIndex: String(elementsIssuanceSelector.inputIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{elementsIssuanceSelector.inputIndex}
			{/snippet}

			{#snippet Value()}
				{[elementsIssuance.$asset == null ? '' : [(elementsIssuance.$asset.name ?? ''), (elementsIssuance.$asset.ticker ?? ''), elementsIssuance.$asset.assetId].filter(Boolean).join(' ') || 'Elements asset', elementsIssuance.$reissuanceTokenAsset == null ? '' : [(elementsIssuance.$reissuanceTokenAsset.name ?? ''), (elementsIssuance.$reissuanceTokenAsset.ticker ?? ''), elementsIssuance.$reissuanceTokenAsset.assetId].filter(Boolean).join(' ') || 'Elements asset'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{elementsIssuance.isReissuance ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
