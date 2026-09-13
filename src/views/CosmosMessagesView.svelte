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
		title = 'Messages',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.CosmosMessage> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CosmosMessage}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				indexInTransaction: true,
				typeUrl: true,
			},
		})
	}
>
	{#snippet Item({ item: cosmosMessage })}
		{@const cosmosMessageSelector = cosmosMessage[EntityMetaKey.Selector]}
		{@const transaction = cosmosMessageSelector.$transaction}
		<EntityView
			entityType={EntityType.CosmosMessage}
			entitySelector={cosmosMessageSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/message/[indexInTransaction=nonNegativeInteger]',
					{
						network: (
							transaction.$network.caip2 !== undefined ?
								caip2StringFromValue(transaction.$network.caip2)
							:
								transaction.$network.slug
						),
						transactionId: transaction.txHash,
						indexInTransaction: String(cosmosMessageSelector.indexInTransaction),
					}
				)
			}
		>
			{#snippet Title()}
				{`Message #${cosmosMessageSelector.indexInTransaction}`}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{cosmosMessage.typeUrl}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
