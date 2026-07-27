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
	}: EntityListViewProps<EntityType.EvmNetwork_GasFee_Block> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmNetwork_GasFee_Block}
	bind:open
	resource={
		selection({
			fields: {
				blockNumber: true,
				baseFeePerGas: true,
				$network: true,
			},
		})
	}
>
	{#snippet Item({ item: evmNetworkGasFeeBlock })}
		{@const evmNetworkGasFeeBlockSelector = evmNetworkGasFeeBlock[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EvmNetwork_GasFee_Block}
			entitySelector={evmNetworkGasFeeBlockSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/fee-market/block/[blockNumber=nonNegativeBigInt]',
					{
						network: (
							'caip2' in evmNetworkGasFeeBlockSelector.$network ?
								String(caip2StringFromValue(evmNetworkGasFeeBlockSelector.$network.caip2))
							:
								String(evmNetworkGasFeeBlockSelector.$network.slug)
						),
						blockNumber: String(evmNetworkGasFeeBlockSelector.blockNumber),
					}
				)
			}
		>
			{#snippet Title()}
				{([(String(evmNetworkGasFeeBlockSelector.blockNumber) ? 'Block ' + String(evmNetworkGasFeeBlockSelector.blockNumber) : ''), (String(evmNetworkGasFeeBlock.baseFeePerGas ?? '') ? String(evmNetworkGasFeeBlock.baseFeePerGas ?? '') + ' wei' : '')].filter(Boolean).join(' ')) || 'EVM network gas fee block'}
			{/snippet}

			{#snippet Value()}
				{(String(evmNetworkGasFeeBlock.baseFeePerGas ?? '') ? String(evmNetworkGasFeeBlock.baseFeePerGas ?? '') + ' wei' : '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{evmNetworkGasFeeBlock.$network.name || (evmNetworkGasFeeBlockSelector.$network.caip2 == null ? '' : `${evmNetworkGasFeeBlockSelector.$network.caip2.namespace}:${evmNetworkGasFeeBlockSelector.$network.caip2.reference}`) || 'Network'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
