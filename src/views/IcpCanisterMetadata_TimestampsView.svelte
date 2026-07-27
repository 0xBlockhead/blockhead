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
	}: EntityListViewProps<EntityType.IcpCanisterMetadata_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IcpCanisterMetadata_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: icpCanisterMetadataTimestamp })}
		<EntityView
			entityType={EntityType.IcpCanisterMetadata_Timestamp}
			entitySelector={icpCanisterMetadataTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				ICP canister metadata timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
