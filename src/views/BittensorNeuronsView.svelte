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
	}: EntityListViewProps<EntityType.BittensorNeuron> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BittensorNeuron}
	bind:open
	resource={
		selection({
			fields: {
				uid: true,
				$subnet: {
					fields: {
						name: true,
					},
				},
			},
		})
	}
>
	{#snippet Item({ item: bittensorNeuron })}
		{@const bittensorNeuronSelector = bittensorNeuron[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BittensorNeuron}
			entitySelector={bittensorNeuronSelector}
		>
			{#snippet Title()}
				{bittensorNeuronSelector.uid}
			{/snippet}

			{#snippet Value()}
				{[(bittensorNeuron.$subnet.name ?? ''), String(bittensorNeuronSelector.$subnet.netuid)].filter(Boolean).join(' ') || 'Bittensor subnet'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
