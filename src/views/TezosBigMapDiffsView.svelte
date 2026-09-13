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
	}: EntityListViewProps<EntityType.TezosBigMapDiff> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosBigMapDiff}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosBigMapDiff })}
		{@const tezosBigMapDiffSelector = tezosBigMapDiff[EntityMetaKey.Selector]}
		{@const operation = tezosBigMapDiffSelector.$operation}
		<EntityView
			entityType={EntityType.TezosBigMapDiff}
			entitySelector={tezosBigMapDiffSelector}
			href={
				resolve(
					'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/operation-group/[operationHash=stringSegment]/(tezosOperationGroup)/operation/[contentIndex=nonNegativeInteger]/(tezosOperation)/big-map/[bigMapId=nonNegativeBigInt]/[keyHash=stringSegment]',
					{
						network: (
							operation.$operationGroup.$network.$network.caip2 !== undefined ?
								caip2StringFromValue(operation.$operationGroup.$network.$network.caip2)
							:
								operation.$operationGroup.$network.$network.slug
						),
						operationHash: operation.$operationGroup.operationHash,
						contentIndex: String(operation.contentIndex),
						bigMapId: String(tezosBigMapDiffSelector.bigMapId),
						keyHash: tezosBigMapDiffSelector.keyHash,
					}
				)
			}
		/>
	{/snippet}
</EntitiesList>
