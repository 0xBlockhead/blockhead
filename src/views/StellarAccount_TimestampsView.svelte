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
	}: EntityListViewProps<EntityType.StellarAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarAccount_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: stellarAccountTimestamp })}
		{@const stellarAccountTimestampSelector = stellarAccountTimestamp[EntityMetaKey.Selector]}
		{@const account = stellarAccountTimestampSelector.$account}
		<EntityView
			entityType={EntityType.StellarAccount_Timestamp}
			entitySelector={stellarAccountTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/stellar/[accountId=stringSegment]/(stellarAccount)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in account.$network.$network ?
								caip2StringFromValue(account.$network.$network.caip2)
							:
								account.$network.$network.slug
						),
						accountId: account.accountId,
						timestampMs: String(stellarAccountTimestampSelector.timestampMs),
						source: stellarAccountTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
