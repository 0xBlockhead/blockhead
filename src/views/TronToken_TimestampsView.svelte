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
	}: EntityListViewProps<EntityType.TronToken_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TronToken_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tronTokenTimestamp })}
		{@const tronTokenTimestampSelector = tronTokenTimestamp[EntityMetaKey.Selector]}
		{@const token = tronTokenTimestampSelector.$token}
		<EntityView
			entityType={EntityType.TronToken_Timestamp}
			entitySelector={tronTokenTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token/[tokenId=stringSegment]/(selection)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							token.$network.caip2 !== undefined ?
								caip2StringFromValue(token.$network.caip2)
							:
								token.$network.slug
						),
						tokenId: token.tokenId,
						timestampMs: String(tronTokenTimestampSelector.timestampMs),
						source: tronTokenTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
