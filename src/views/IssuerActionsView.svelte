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
	}: EntityListViewProps<EntityType.IssuerAction> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.IssuerAction}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: issuerAction })}
		<EntityView
			entityType={EntityType.IssuerAction}
			entitySelector={issuerAction[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				issuer action
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
