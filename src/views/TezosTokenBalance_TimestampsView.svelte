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
	}: EntityListViewProps<EntityType.TezosTokenBalance_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosTokenBalance_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosTokenBalanceTimestamp })}
		{@const tezosTokenBalanceTimestampSelector = tezosTokenBalanceTimestamp[EntityMetaKey.Selector]}
		{@const account = tezosTokenBalanceTimestampSelector.$account}
		{@const token = tezosTokenBalanceTimestampSelector.$token}
		<EntityView
			entityType={EntityType.TezosTokenBalance_Timestamp}
			entitySelector={tezosTokenBalanceTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[address=stringSegment]/(selection)/token/[contractAddress=stringSegment]/[tokenId=nonNegativeBigInt]/level/[level=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							account.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(account.$network.$network.caip2)
							:
								account.$network.$network.slug
						),
						address: account.address,
						contractAddress: token.contractAddress,
						tokenId: String(token.tokenId),
						level: String(tezosTokenBalanceTimestampSelector.level),
						source: tezosTokenBalanceTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
