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
	}: EntityListViewProps<EntityType.HederaNft_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaNft_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaNftTimestamp })}
		{@const hederaNftTimestampSelector = hederaNftTimestamp[EntityMetaKey.Selector]}
		{@const nft = hederaNftTimestampSelector.$nft}
		<EntityView
			entityType={EntityType.HederaNft_Timestamp}
			entitySelector={hederaNftTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token/[tokenId=stringSegment]/(selection)/nft/[serialNumber=nonNegativeBigInt]/(hederaNft)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in nft.$token.$network ?
								caip2StringFromValue(nft.$token.$network.caip2)
							:
								nft.$token.$network.slug
						),
						tokenId: nft.$token.tokenId,
						serialNumber: String(nft.serialNumber),
						timestampMs: String(hederaNftTimestampSelector.timestampMs),
						source: hederaNftTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
