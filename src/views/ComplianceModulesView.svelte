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
	}: EntityListViewProps<EntityType.ComplianceModule> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ComplianceModule}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: complianceModule })}
		<EntityView
			entityType={EntityType.ComplianceModule}
			entitySelector={complianceModule[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				compliance module
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
