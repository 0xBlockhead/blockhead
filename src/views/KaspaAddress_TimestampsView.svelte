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
	}: EntityListViewProps<EntityType.KaspaAddress_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.KaspaAddress_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: kaspaAddressTimestamp })}
		<EntityView
			entityType={EntityType.KaspaAddress_Timestamp}
			entitySelector={kaspaAddressTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				kaspa address timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
