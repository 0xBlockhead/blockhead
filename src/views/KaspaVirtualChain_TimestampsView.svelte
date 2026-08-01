<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Kaspa virtual-chain observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.KaspaVirtualChain_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.KaspaVirtualChain_Timestamp}
	{title}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: kaspaVirtualChainTimestamp })}
		<EntityView
			entityType={EntityType.KaspaVirtualChain_Timestamp}
			entitySelector={kaspaVirtualChainTimestamp[EntityMetaKey.Selector]}
		/>
	{/snippet}
</EntitiesList>
