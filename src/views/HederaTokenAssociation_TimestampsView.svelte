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
	}: EntityListViewProps<EntityType.HederaTokenAssociation_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaTokenAssociation_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaTokenAssociationTimestamp })}
		{@const hederaTokenAssociationTimestampSelector = hederaTokenAssociationTimestamp[EntityMetaKey.Selector]}
		{@const association = hederaTokenAssociationTimestampSelector.$association}
		<EntityView
			entityType={EntityType.HederaTokenAssociation_Timestamp}
			entitySelector={hederaTokenAssociationTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/token/[tokenId=stringSegment]/(hederaTokenAssociation)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in association.$account.$network ?
								caip2StringFromValue(association.$account.$network.caip2)
							:
								association.$account.$network.slug
						),
						accountId: association.$account.accountId,
						tokenId: association.$token.tokenId,
						timestampMs: String(hederaTokenAssociationTimestampSelector.timestampMs),
						source: hederaTokenAssociationTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
