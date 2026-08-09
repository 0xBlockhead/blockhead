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
	}: EntityListViewProps<EntityType.StarknetTransaction_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StarknetTransaction_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					$transaction: true,
					timestampMs: true,
					executionStatus: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: starknetTransactionTimestamp })}
		{@const starknetTransactionTimestampSelector = starknetTransactionTimestamp[EntityMetaKey.Selector]}
		{@const transaction = starknetTransactionTimestampSelector.$transaction}
		<EntityView
			entityType={EntityType.StarknetTransaction_Timestamp}
			entitySelector={starknetTransactionTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/transaction/starknet/[transactionHash=stringSegment]/(starknetTransaction)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in transaction.$network.$network ?
								caip2StringFromValue(transaction.$network.$network.caip2)
							:
								transaction.$network.$network.slug
						),
						transactionHash: transaction.transactionHash,
						timestampMs: String(starknetTransactionTimestampSelector.timestampMs),
						source: starknetTransactionTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{starknetTransactionTimestampSelector.$transaction.transactionHash || 'starknet transaction'}
			{/snippet}

			{#snippet Value()}
				{starknetTransactionTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{starknetTransactionTimestamp.executionStatus ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
