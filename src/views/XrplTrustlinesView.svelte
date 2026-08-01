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
	}: EntityListViewProps<EntityType.XrplTrustline> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XrplTrustline}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: xrplTrustline })}
		{@const xrplTrustlineSelector = xrplTrustline[EntityMetaKey.Selector]}
		{@const network = xrplTrustlineSelector.$network}
		<EntityView
			entityType={EntityType.XrplTrustline}
			entitySelector={xrplTrustlineSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/trustline/[account=stringSegment]/[currency=stringSegment]/[issuer=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						account: xrplTrustlineSelector.account,
						currency: xrplTrustlineSelector.currency,
						issuer: xrplTrustlineSelector.issuer,
					}
				)
			}
		>
			{#snippet Title()}
				XRPL trustline
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
