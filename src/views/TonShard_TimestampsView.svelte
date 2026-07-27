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
	}: EntityListViewProps<EntityType.TonShard_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonShard_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonShardTimestamp })}
		<EntityView
			entityType={EntityType.TonShard_Timestamp}
			entitySelector={tonShardTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				TON shard timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
