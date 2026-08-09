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
	}: EntityListViewProps<EntityType.SuiObjectChange> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiObjectChange}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: suiObjectChange })}
		{@const suiObjectChangeSelector = suiObjectChange[EntityMetaKey.Selector]}
		{@const transaction = suiObjectChangeSelector.$transaction}
		<EntityView
			entityType={EntityType.SuiObjectChange}
			entitySelector={suiObjectChangeSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/sui-tx/[digest=stringSegment]/(suiTransaction)/object-change/[changeIndex=nonNegativeInteger]',
					{
						network: (
							'caip2' in transaction.$network.$network ?
								caip2StringFromValue(transaction.$network.$network.caip2)
							:
								transaction.$network.$network.slug
						),
						digest: transaction.digest,
						changeIndex: String(suiObjectChangeSelector.changeIndex),
					}
				)
			}
		>
			{#snippet Title()}
				Sui object change
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
