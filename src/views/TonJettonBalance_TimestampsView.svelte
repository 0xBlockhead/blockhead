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
	}: EntityListViewProps<EntityType.TonJettonBalance_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonJettonBalance_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonJettonBalanceTimestamp })}
		{@const tonJettonBalanceTimestampSelector = tonJettonBalanceTimestamp[EntityMetaKey.Selector]}
		{@const account = tonJettonBalanceTimestampSelector.$account}
		<EntityView
			entityType={EntityType.TonJettonBalance_Timestamp}
			entitySelector={tonJettonBalanceTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/jetton/[masterAddress=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in account.$network ?
								caip2StringFromValue(account.$network.caip2)
							:
								account.$network.slug
						),
						accountId: account.address,
						masterAddress: tonJettonBalanceTimestampSelector.$jetton.masterAddress,
						timestampMs: String(tonJettonBalanceTimestampSelector.timestampMs),
						source: tonJettonBalanceTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				TON jetton balance timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
