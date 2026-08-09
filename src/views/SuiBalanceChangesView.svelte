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
	}: EntityListViewProps<EntityType.SuiBalanceChange> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiBalanceChange}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: suiBalanceChange })}
		{@const suiBalanceChangeSelector = suiBalanceChange[EntityMetaKey.Selector]}
		{@const transaction = suiBalanceChangeSelector.$transaction}
		<EntityView
			entityType={EntityType.SuiBalanceChange}
			entitySelector={suiBalanceChangeSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/sui-tx/[digest=stringSegment]/(suiTransaction)/balance-change/[changeIndex=nonNegativeInteger]',
					{
						network: (
							'caip2' in transaction.$network.$network ?
								caip2StringFromValue(transaction.$network.$network.caip2)
							:
								transaction.$network.$network.slug
						),
						digest: transaction.digest,
						changeIndex: String(suiBalanceChangeSelector.changeIndex),
					}
				)
			}
		>
			{#snippet Title()}
				Sui balance change
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
