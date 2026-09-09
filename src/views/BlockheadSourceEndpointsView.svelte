<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadSourceEndpoint> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadSourceEndpoint}
	bind:open
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Constants_Internal,
				Source.Local_Internal,
			],
			fields: {
				endpointUrl: true,
				apiFamily: true,
				wireProtocol: true,
				targetKey: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadSourceEndpoint })}
		{@const blockheadSourceEndpointSelector = blockheadSourceEndpoint[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadSourceEndpoint}
			entitySelector={blockheadSourceEndpointSelector}
			href={
				resolve(
					'/~/manage/source/[sourceId=stringSegment]/(blockheadSource)/endpoint/[bindingId=stringSegment]/[endpointIndex=nonNegativeInteger]',
					{
						sourceId: blockheadSourceEndpointSelector.$source.id,
						bindingId: encodeURIComponent(blockheadSourceEndpointSelector.bindingId),
						endpointIndex: String(blockheadSourceEndpointSelector.endpointIndex),
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadSourceEndpoint.endpointUrl || 'source endpoint'}
			{/snippet}

			{#snippet Value()}
				{[blockheadSourceEndpoint.apiFamily, blockheadSourceEndpoint.wireProtocol].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadSourceEndpoint.targetKey}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
