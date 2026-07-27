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
	}: EntityListViewProps<EntityType.TonNftItem_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonNftItem_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonNftItemTimestamp })}
		<EntityView
			entityType={EntityType.TonNftItem_Timestamp}
			entitySelector={tonNftItemTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				TON NFT item timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
