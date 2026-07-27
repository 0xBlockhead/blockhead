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
	}: EntityListViewProps<EntityType.StellarAccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.StellarAccount}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: stellarAccount })}
		<EntityView
			entityType={EntityType.StellarAccount}
			entitySelector={stellarAccount[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				stellar account
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
