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
	}: EntityListViewProps<EntityType.HederaTokenCustomFee> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaTokenCustomFee}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaTokenCustomFee })}
		{@const hederaTokenCustomFeeSelector = hederaTokenCustomFee[EntityMetaKey.Selector]}
		{@const tokenTimestamp = hederaTokenCustomFeeSelector.$tokenTimestamp}
		<EntityView
			entityType={EntityType.HederaTokenCustomFee}
			entitySelector={hederaTokenCustomFeeSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/token/[tokenId=stringSegment]/(selection)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]/(selection)/fee/[feeIndex=nonNegativeInteger]',
					{
						network: (
							tokenTimestamp.$token.$network.caip2 !== undefined ?
								caip2StringFromValue(tokenTimestamp.$token.$network.caip2)
							:
								tokenTimestamp.$token.$network.slug
						),
						tokenId: tokenTimestamp.$token.tokenId,
						timestampMs: String(tokenTimestamp.timestampMs),
						source: tokenTimestamp.source,
						feeIndex: String(hederaTokenCustomFeeSelector.feeIndex),
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
