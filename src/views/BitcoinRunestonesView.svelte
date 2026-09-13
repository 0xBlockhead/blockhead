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
	}: EntityListViewProps<EntityType.BitcoinRunestone> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BitcoinRunestone}
	bind:open
	resource={
		selection({
			fields: {
				outputIndex: true,
				isCenotaph: true,
			},
		})
	}
>
	{#snippet Item({ item: bitcoinRunestone })}
		{@const bitcoinRunestoneSelector = bitcoinRunestone[EntityMetaKey.Selector]}
		{@const transaction = bitcoinRunestoneSelector.$transaction}
		<EntityView
			entityType={EntityType.BitcoinRunestone}
			entitySelector={bitcoinRunestoneSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/runestone/[outputIndex=nonNegativeInteger]',
					{
						network: (
							transaction.$network.caip2 !== undefined ?
								caip2StringFromValue(transaction.$network.caip2)
							:
								transaction.$network.slug
						),
						transactionId: transaction.txId,
						outputIndex: String(bitcoinRunestoneSelector.outputIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{bitcoinRunestoneSelector.outputIndex}
			{/snippet}

			{#snippet Value()}
				{bitcoinRunestone.isCenotaph}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
