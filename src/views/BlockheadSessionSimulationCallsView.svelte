<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadSessionSimulationCall> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadSessionSimulationCall}
	bind:open
	resource={
		selection({
			fields: {
				callPath: true,
				callType: true,
				depth: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadSessionSimulationCall })}
		{@const blockheadSessionSimulationCallSelector = blockheadSessionSimulationCall[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadSessionSimulationCall}
			entitySelector={blockheadSessionSimulationCallSelector}
			href={
				resolve(
					'/~/session/simulation/[simulationId=stringSegment]/call/[callPath=stringSegment]',
					{
						simulationId: blockheadSessionSimulationCallSelector.simulationId,
						callPath: blockheadSessionSimulationCallSelector.callPath,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadSessionSimulationCallSelector.callPath || 'blockhead session simulation call'}
			{/snippet}

			{#snippet Value()}
				{blockheadSessionSimulationCall.callType ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadSessionSimulationCall.depth}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
