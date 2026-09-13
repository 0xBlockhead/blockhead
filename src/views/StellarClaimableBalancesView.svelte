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
	}: EntityListViewProps<EntityType.StellarClaimableBalance> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarClaimableBalance}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: stellarClaimableBalance })}
		{@const stellarClaimableBalanceSelector = stellarClaimableBalance[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.StellarClaimableBalance}
			entitySelector={stellarClaimableBalanceSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/claimable-balance/[claimableBalanceId=stringSegment]',
					{
						network: (
							stellarClaimableBalanceSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(stellarClaimableBalanceSelector.$network.$network.caip2)
							:
								stellarClaimableBalanceSelector.$network.$network.slug
						),
						claimableBalanceId: stellarClaimableBalanceSelector.claimableBalanceId,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
