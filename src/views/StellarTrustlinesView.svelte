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
	}: EntityListViewProps<EntityType.StellarTrustline> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarTrustline}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: stellarTrustline })}
		{@const stellarTrustlineSelector = stellarTrustline[EntityMetaKey.Selector]}
		{@const account = stellarTrustlineSelector.$account}
		<EntityView
			entityType={EntityType.StellarTrustline}
			entitySelector={stellarTrustlineSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/stellar/[accountId=stringSegment]/(stellarAccount)/asset/[assetKey=stringSegment]',
					{
						network: (
							'caip2' in account.$network.$network ?
								caip2StringFromValue(account.$network.$network.caip2)
							:
								account.$network.$network.slug
						),
						accountId: account.accountId,
						assetKey: stellarTrustlineSelector.$asset.assetKey,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
