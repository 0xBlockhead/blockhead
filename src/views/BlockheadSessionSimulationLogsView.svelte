<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { EvmAddress } from '$/schema/ZeroExHex.ts'


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
				{String(blockheadSessionSimulationLogSelector.logIndex) || 'blockhead session simulation log'}
			{/snippet}

			{#snippet Value()}
				{String(blockheadSessionSimulationLog.address ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(blockheadSessionSimulationLog.callPath ?? '')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
