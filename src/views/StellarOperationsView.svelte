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
	}: EntityListViewProps<EntityType.StellarOperation> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarOperation}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: stellarOperation })}
		{@const stellarOperationSelector = stellarOperation[EntityMetaKey.Selector]}
		{@const transaction = stellarOperationSelector.$transaction}
		<EntityView
			entityType={EntityType.StellarOperation}
			entitySelector={stellarOperationSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/transaction/stellar/[hash=stringSegment]/(stellarTransaction)/operation/[operationIndex=nonNegativeInteger]',
					{
						network: (
							transaction.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(transaction.$network.$network.caip2)
							:
								transaction.$network.$network.slug
						),
						hash: transaction.hash,
						operationIndex: String(stellarOperationSelector.operationIndex),
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
