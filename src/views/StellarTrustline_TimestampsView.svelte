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
	}: EntityListViewProps<EntityType.StellarTrustline_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarTrustline_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: stellarTrustlineTimestamp })}
		{@const stellarTrustlineTimestampSelector = stellarTrustlineTimestamp[EntityMetaKey.Selector]}
		{@const trustline = stellarTrustlineTimestampSelector.$trustline}
		<EntityView
			entityType={EntityType.StellarTrustline_Timestamp}
			entitySelector={stellarTrustlineTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/stellar/[accountId=stringSegment]/(stellarAccount)/asset/[assetKey=stringSegment]/(stellarTrustline)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							trustline.$account.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(trustline.$account.$network.$network.caip2)
							:
								trustline.$account.$network.$network.slug
						),
						accountId: trustline.$account.accountId,
						assetKey: trustline.$asset.assetKey,
						timestampMs: String(stellarTrustlineTimestampSelector.timestampMs),
						source: stellarTrustlineTimestampSelector.source,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
