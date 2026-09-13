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
	}: EntityListViewProps<EntityType.TezosToken_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosToken_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosTokenTimestamp })}
		{@const tezosTokenTimestampSelector = tezosTokenTimestamp[EntityMetaKey.Selector]}
		{@const token = tezosTokenTimestampSelector.$token}
		<EntityView
			entityType={EntityType.TezosToken_Timestamp}
			entitySelector={tezosTokenTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/token/[contractAddress=stringSegment]/[tokenId=nonNegativeBigInt]/(tezosToken)/level/[level=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							token.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(token.$network.$network.caip2)
							:
								token.$network.$network.slug
						),
						contractAddress: token.contractAddress,
						tokenId: String(token.tokenId),
						level: String(tezosTokenTimestampSelector.level),
						source: tezosTokenTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
