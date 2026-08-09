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
	}: EntityListViewProps<EntityType.XrplTrustline_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XrplTrustline_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: xrplTrustlineTimestamp })}
		{@const xrplTrustlineTimestampSelector = xrplTrustlineTimestamp[EntityMetaKey.Selector]}
		{@const trustline = xrplTrustlineTimestampSelector.$trustline}
		<EntityView
			entityType={EntityType.XrplTrustline_Timestamp}
			entitySelector={xrplTrustlineTimestampSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/trustline/[account=stringSegment]/[currency=stringSegment]/[issuer=stringSegment]/(xrplTrustline)/observations/[ledgerIndex=nonNegativeBigInt]/[source=stringSegment]',
					{
						network: (
							'caip2' in trustline.$network ?
								caip2StringFromValue(trustline.$network.caip2)
							:
								trustline.$network.slug
						),
						account: trustline.account,
						currency: trustline.currency,
						issuer: trustline.issuer,
						ledgerIndex: String(xrplTrustlineTimestampSelector.ledgerIndex),
						source: xrplTrustlineTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				XRPL trustline timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
