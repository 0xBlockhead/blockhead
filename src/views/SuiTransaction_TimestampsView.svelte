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
	}: EntityListViewProps<EntityType.SuiTransaction_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiTransaction_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: suiTransactionTimestamp })}
		{@const suiTransactionTimestampSelector = suiTransactionTimestamp[EntityMetaKey.Selector]}
		{@const transaction = suiTransactionTimestampSelector.$transaction}
		<EntityView
			entityType={EntityType.SuiTransaction_Timestamp}
			entitySelector={suiTransactionTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/sui-tx/[digest=stringSegment]/(suiTransaction)/observations/[checkpointSequence=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							'caip2' in transaction.$network.$network ?
								caip2StringFromValue(transaction.$network.$network.caip2)
							:
								transaction.$network.$network.slug
						),
						digest: transaction.digest,
						checkpointSequence: String(suiTransactionTimestampSelector.checkpointSequence),
						source: suiTransactionTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				Sui transaction timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
