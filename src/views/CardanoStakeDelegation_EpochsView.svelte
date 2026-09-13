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
	}: EntityListViewProps<EntityType.CardanoStakeDelegation_Epoch> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoStakeDelegation_Epoch}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: cardanoStakeDelegationEpoch })}
		{@const cardanoStakeDelegationEpochSelector = cardanoStakeDelegationEpoch[EntityMetaKey.Selector]}
		{@const stakeCredential = cardanoStakeDelegationEpochSelector.$stakeCredential}
		<EntityView
			entityType={EntityType.CardanoStakeDelegation_Epoch}
			entitySelector={cardanoStakeDelegationEpochSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/stake-credential/[credential=stringSegment]/(cardanoStakeCredential)/delegation/[epoch=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							stakeCredential.$network.caip2 !== undefined ?
								caip2StringFromValue(stakeCredential.$network.caip2)
							:
								stakeCredential.$network.slug
						),
						credential: stakeCredential.credential,
						epoch: String(cardanoStakeDelegationEpochSelector.epoch),
						source: cardanoStakeDelegationEpochSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				Cardano stake delegation epoch
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
