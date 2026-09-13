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
	}: EntityListViewProps<EntityType.AvalanchePChainTransaction_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AvalanchePChainTransaction_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				status: true,
				blockHeight: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: avalanchePChainTransactionTimestamp })}
		{@const avalanchePChainTransactionTimestampSelector = avalanchePChainTransactionTimestamp[EntityMetaKey.Selector]}
		{@const transaction = avalanchePChainTransactionTimestampSelector.$transaction}
		<EntityView
			entityType={EntityType.AvalanchePChainTransaction_Timestamp}
			entitySelector={avalanchePChainTransactionTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/avalanche-tx/[txId=stringSegment]/(avalanchePChainTransaction)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							transaction.$network.caip2 !== undefined ?
								caip2StringFromValue(transaction.$network.caip2)
							:
								transaction.$network.slug
						),
						txId: transaction.txId,
						timestampMs: String(avalanchePChainTransactionTimestampSelector.timestampMs),
						source: avalanchePChainTransactionTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{avalanchePChainTransactionTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[(avalanchePChainTransactionTimestamp.status ?? ''), String(avalanchePChainTransactionTimestamp.blockHeight ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{avalanchePChainTransactionTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
