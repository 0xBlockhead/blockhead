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
	}: EntityListViewProps<EntityType.StellarClaimableBalance_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarClaimableBalance_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: stellarClaimableBalanceTimestamp })}
		{@const stellarClaimableBalanceTimestampSelector = stellarClaimableBalanceTimestamp[EntityMetaKey.Selector]}
		{@const claimableBalance = stellarClaimableBalanceTimestampSelector.$claimableBalance}
		<EntityView
			entityType={EntityType.StellarClaimableBalance_Timestamp}
			entitySelector={stellarClaimableBalanceTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/claimable-balance/[claimableBalanceId=stringSegment]/(stellarClaimableBalance)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							claimableBalance.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(claimableBalance.$network.$network.caip2)
							:
								claimableBalance.$network.$network.slug
						),
						claimableBalanceId: claimableBalance.claimableBalanceId,
						timestampMs: String(stellarClaimableBalanceTimestampSelector.timestampMs),
						source: stellarClaimableBalanceTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
