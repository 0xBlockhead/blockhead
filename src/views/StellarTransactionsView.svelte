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
	}: EntityListViewProps<EntityType.StellarTransaction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarTransaction}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: stellarTransaction })}
		{@const stellarTransactionSelector = stellarTransaction[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.StellarTransaction}
			entitySelector={stellarTransactionSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/transaction/stellar/[hash=stringSegment]',
					{
						network: (
							stellarTransactionSelector.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(stellarTransactionSelector.$network.$network.caip2)
							:
								stellarTransactionSelector.$network.$network.slug
						),
						hash: stellarTransactionSelector.hash,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
