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
	}: EntityListViewProps<EntityType.KaspaAcceptedTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.KaspaAcceptedTransaction}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: kaspaAcceptedTransaction })}
		{@const kaspaAcceptedTransactionSelector = kaspaAcceptedTransaction[EntityMetaKey.Selector]}
		{@const acceptingBlock = kaspaAcceptedTransactionSelector.$acceptingBlock}
		<EntityView
			entityType={EntityType.KaspaAcceptedTransaction}
			entitySelector={kaspaAcceptedTransactionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/block/[blockHash=stringSegment]/(kaspaBlock)/accepted-transaction/[transactionId=stringSegment]',
					{
						network: (
							'caip2' in acceptingBlock.$network.$network ?
								caip2StringFromValue(acceptingBlock.$network.$network.caip2)
							:
								acceptingBlock.$network.$network.slug
						),
						blockHash: acceptingBlock.blockHash,
						transactionId: kaspaAcceptedTransactionSelector.$transaction.transactionId,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
