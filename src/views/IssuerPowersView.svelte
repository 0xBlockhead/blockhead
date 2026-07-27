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
	}: EntityListViewProps<EntityType.IssuerPower> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IssuerPower}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: issuerPower })}
		<EntityView
			entityType={EntityType.IssuerPower}
			entitySelector={issuerPower[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				issuer power
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
