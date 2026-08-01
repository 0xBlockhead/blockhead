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
	}: EntityListViewProps<EntityType.CardanoCommittee_Epoch> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoCommittee_Epoch}
	bind:open
	resource={
		selection({
			fields: {
				epoch: true,
				memberCount: true,
			},
		})
	}
>
	{#snippet Item({ item: cardanoCommitteeEpoch })}
		{@const cardanoCommitteeEpochSelector = cardanoCommitteeEpoch[EntityMetaKey.Selector]}
		{@const network = cardanoCommitteeEpochSelector.$network}
		<EntityView
			entityType={EntityType.CardanoCommittee_Epoch}
			entitySelector={cardanoCommitteeEpochSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/governance/committee/epoch/[epoch=nonNegativeInteger]/[source=stringSegment]',
					{
						network: (
							'caip2' in network ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						epoch: String(cardanoCommitteeEpochSelector.epoch),
						source: cardanoCommitteeEpochSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{'Epoch ' + cardanoCommitteeEpochSelector.epoch}
			{/snippet}

			{#snippet Value()}
				{cardanoCommitteeEpoch.memberCount ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
