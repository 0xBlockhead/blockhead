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
	}: EntityListViewProps<EntityType.HyperliquidValidator_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HyperliquidValidator_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hyperliquidValidatorTimestamp })}
		<EntityView
			entityType={EntityType.HyperliquidValidator_Timestamp}
			entitySelector={hyperliquidValidatorTimestamp[EntityMetaKey.Selector]}
		/>
	{/snippet}
</EntitiesList>
