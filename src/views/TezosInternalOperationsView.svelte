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
	}: EntityListViewProps<EntityType.TezosInternalOperation> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosInternalOperation}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosInternalOperation })}
		{@const tezosInternalOperationSelector = tezosInternalOperation[EntityMetaKey.Selector]}
		{@const parentOperation = tezosInternalOperationSelector.$parentOperation}
		<EntityView
			entityType={EntityType.TezosInternalOperation}
			entitySelector={tezosInternalOperationSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/operation-group/[operationHash=stringSegment]/(tezosOperationGroup)/operation/[contentIndex=nonNegativeInteger]/(tezosOperation)/internal/[internalIndex=nonNegativeInteger]',
					{
						network: (
							'caip2' in parentOperation.$operationGroup.$network.$network ?
								caip2StringFromValue(parentOperation.$operationGroup.$network.$network.caip2)
							:
								parentOperation.$operationGroup.$network.$network.slug
						),
						operationHash: parentOperation.$operationGroup.operationHash,
						contentIndex: String(parentOperation.contentIndex),
						internalIndex: String(tezosInternalOperationSelector.internalIndex),
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
