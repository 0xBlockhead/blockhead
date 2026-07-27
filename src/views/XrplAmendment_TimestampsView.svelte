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
	}: EntityListViewProps<EntityType.XrplAmendment_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.XrplAmendment_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: xrplAmendmentTimestamp })}
		<EntityView
			entityType={EntityType.XrplAmendment_Timestamp}
			entitySelector={xrplAmendmentTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				XRPL amendment timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
