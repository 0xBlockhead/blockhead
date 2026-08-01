<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadSessionSimulationLog> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadSessionSimulationLog}
	bind:open
	resource={
		selection({
			fields: {
				logIndex: true,
				address: true,
				callPath: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadSessionSimulationLog })}
		{@const blockheadSessionSimulationLogSelector = blockheadSessionSimulationLog[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadSessionSimulationLog}
			entitySelector={blockheadSessionSimulationLogSelector}
		>
			{#snippet Title()}
				{blockheadSessionSimulationLogSelector.logIndex}
			{/snippet}

			{#snippet Value()}
				{blockheadSessionSimulationLog.address ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadSessionSimulationLog.callPath ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
