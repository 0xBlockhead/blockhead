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
	}: EntityListViewProps<EntityType.TezosOperation> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosOperation}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosOperation })}
		{@const tezosOperationSelector = tezosOperation[EntityMetaKey.Selector]}
		{@const operationGroup = tezosOperationSelector.$operationGroup}
		<EntityView
			entityType={EntityType.TezosOperation}
			entitySelector={tezosOperationSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/operation-group/[operationHash=stringSegment]/(tezosOperationGroup)/operation/[contentIndex=nonNegativeInteger]',
					{
						network: (
							operationGroup.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(operationGroup.$network.$network.caip2)
							:
								operationGroup.$network.$network.slug
						),
						operationHash: operationGroup.operationHash,
						contentIndex: String(tezosOperationSelector.contentIndex),
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
