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
	}: EntityListViewProps<EntityType.HyperliquidValidator> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidValidator}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidValidator })}
		<EntityView
			entityType={EntityType.HyperliquidValidator}
			entitySelector={hyperliquidValidator[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				hyperliquid validator
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
