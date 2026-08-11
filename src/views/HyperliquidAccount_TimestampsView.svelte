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
	}: EntityListViewProps<EntityType.HyperliquidAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidAccount_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidAccountTimestamp })}
		{@const hyperliquidAccountTimestampSelector = hyperliquidAccountTimestamp[EntityMetaKey.Selector]}
		{@const account = hyperliquidAccountTimestampSelector.$account}
		<EntityView
			entityType={EntityType.HyperliquidAccount_Timestamp}
			entitySelector={hyperliquidAccountTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]/(nearAccountTimestamp)/[infoType=stringSegment]',
					{
						network: (
							'caip2' in account.$network ?
								caip2StringFromValue(account.$network.caip2)
							:
								account.$network.slug
						),
						accountId: account.address,
						timestampMs: String(hyperliquidAccountTimestampSelector.timestampMs),
						source: hyperliquidAccountTimestampSelector.source,
						infoType: hyperliquidAccountTimestampSelector.infoType,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
