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
	}: EntityListViewProps<EntityType.EasAttestation_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EasAttestation_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: easAttestationTimestamp })}
		<EntityView
			entityType={EntityType.EasAttestation_Timestamp}
			entitySelector={easAttestationTimestamp[EntityMetaKey.Selector]}
		/>
	{/snippet}
</EntitiesList>
