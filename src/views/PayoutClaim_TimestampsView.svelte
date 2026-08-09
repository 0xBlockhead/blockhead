<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.PayoutClaim_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.PayoutClaim_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: payoutClaimTimestamp })}
		{@const payoutClaimTimestampSelector = payoutClaimTimestamp[EntityMetaKey.Selector]}
		{@const payout = payoutClaimTimestampSelector.$payout}
		<EntityView
			entityType={EntityType.PayoutClaim_Timestamp}
			entitySelector={payoutClaimTimestampSelector}
			href={
				resolve(
					'/payout/[payoutSource=stringSegment]/[payoutId=stringSegment]/(payout)/claim/[namespace=stringSegment]:[reference=stringSegment]/[accountAddress=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						payoutSource: payout.source,
						payoutId: payout.payoutId,
						namespace: payoutClaimTimestampSelector.$account.caip10.namespace,
						reference: payoutClaimTimestampSelector.$account.caip10.reference,
						accountAddress: payoutClaimTimestampSelector.$account.caip10.accountAddress,
						timestampMs: String(payoutClaimTimestampSelector.timestampMs),
						source: payoutClaimTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
