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
	}: EntityListViewProps<EntityType.TonWorkchain> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonWorkchain}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonWorkchain })}
		<EntityView
			entityType={EntityType.TonWorkchain}
			entitySelector={tonWorkchain[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				TON workchain
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
