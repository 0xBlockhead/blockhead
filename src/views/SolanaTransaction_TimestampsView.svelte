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
	}: EntityListViewProps<EntityType.SolanaTransaction_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SolanaTransaction_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					slot: true,
					status: true,
					timestampMs: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: solanaTransactionTimestamp })}
		{@const solanaTransactionTimestampSelector = solanaTransactionTimestamp[EntityMetaKey.Selector]}
		{@const transaction = solanaTransactionTimestampSelector.$transaction}
		<EntityView
			entityType={EntityType.SolanaTransaction_Timestamp}
			entitySelector={solanaTransactionTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/observations/[slot=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							'caip2' in transaction.$network ?
								caip2StringFromValue(transaction.$network.caip2)
							:
								transaction.$network.slug
						),
						transactionId: transaction.signature,
						slot: String(solanaTransactionTimestampSelector.slot),
						source: solanaTransactionTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{solanaTransactionTimestampSelector.slot}
			{/snippet}

			{#snippet Value()}
				{solanaTransactionTimestamp.status ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{solanaTransactionTimestamp.timestampMs ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
