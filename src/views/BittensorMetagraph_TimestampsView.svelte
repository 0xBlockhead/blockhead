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
	}: EntityListViewProps<EntityType.BittensorMetagraph_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BittensorMetagraph_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				metagraphByteLength: true,
			},
		})
	}
>
	{#snippet Item({ item: bittensorMetagraphTimestamp })}
		{@const bittensorMetagraphTimestampSelector = bittensorMetagraphTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BittensorMetagraph_Timestamp}
			entitySelector={bittensorMetagraphTimestampSelector}
		>
			{#snippet Title()}
				{bittensorMetagraphTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{bittensorMetagraphTimestamp.metagraphByteLength ?? ''}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
