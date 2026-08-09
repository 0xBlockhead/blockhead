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
	}: EntityListViewProps<EntityType.BlockheadSessionSimulation> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadSessionSimulation}
	bind:open
	resource={
		selection({
			...{
				fields: {
					status: true,
					createdAt: true,
					$session: {
						fields: {
							name: true,
							status: true,
							updatedAt: true,
						},
					},
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadSessionSimulation })}
		{@const blockheadSessionSimulationSelector = blockheadSessionSimulation[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BlockheadSessionSimulation}
			entitySelector={blockheadSessionSimulationSelector}
			href={
				resolve(
					'/~/session/simulation/[id=stringSegment]',
					{
						id: blockheadSessionSimulationSelector.id,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadSessionSimulation.status || 'blockhead session simulation'}
			{/snippet}

			{#snippet Value()}
				{blockheadSessionSimulation.createdAt}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(blockheadSessionSimulation.$session.name ?? '') || blockheadSessionSimulation.$session.id || 'session'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
