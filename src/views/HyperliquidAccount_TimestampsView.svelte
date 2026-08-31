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
	}: EntityListViewProps<EntityType.HyperliquidAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidAccount_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidAccountTimestamp })}
		<EntityView
			entityType={EntityType.HyperliquidAccount_Timestamp}
			entitySelector={hyperliquidAccountTimestamp[EntityMetaKey.Selector]}
		/>
	{/snippet}
</EntitiesList>
