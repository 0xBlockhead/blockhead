<!-- Generated from APP.ts. Do not edit by hand. -->

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
		})
	}
>
	{#snippet Item({ item: blockheadSessionSimulation })}
		<EntityView
			entityType={EntityType.BlockheadSessionSimulation}
			entitySelector={blockheadSessionSimulation[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{blockheadSessionSimulation.status || 'blockhead session simulation'}
			{/snippet}

			{#snippet Value()}
				{String(blockheadSessionSimulation.createdAt)}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{(blockheadSessionSimulation.$session.name ?? '') || blockheadSessionSimulation.$session.id || 'session'}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
