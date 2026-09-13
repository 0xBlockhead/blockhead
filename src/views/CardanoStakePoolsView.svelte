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
	}: EntityListViewProps<EntityType.CardanoStakePool> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.CardanoStakePool}
	bind:open
	resource={
		selection({
			fields: {
				ticker: true,
				poolId: true,
				vrfKeyHash: true,
			},
		})
	}
>
	{#snippet Item({ item: cardanoStakePool })}
		{@const cardanoStakePoolSelector = cardanoStakePool[EntityMetaKey.Selector]}
		{@const network = cardanoStakePoolSelector.$network}
		<EntityView
			entityType={EntityType.CardanoStakePool}
			entitySelector={cardanoStakePoolSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/stake-pool/[poolId=stringSegment]',
					{
						network: (
							network.caip2 !== undefined ?
								caip2StringFromValue(network.caip2)
							:
								network.slug
						),
						poolId: cardanoStakePoolSelector.poolId,
					}
				)
			}
		>
			{#snippet Title()}
				{[(cardanoStakePool.ticker ?? ''), cardanoStakePoolSelector.poolId].filter(Boolean).join(' ') || 'Cardano stake pool'}
			{/snippet}

			{#snippet Value()}
				{cardanoStakePool.vrfKeyHash ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
