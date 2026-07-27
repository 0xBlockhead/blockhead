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
	}: EntityListViewProps<EntityType.TransferRestrictionCheck_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TransferRestrictionCheck_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: transferRestrictionCheckTimestamp })}
		<EntityView
			entityType={EntityType.TransferRestrictionCheck_Timestamp}
			entitySelector={transferRestrictionCheckTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				transfer restriction check timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
