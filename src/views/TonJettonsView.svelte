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
	}: EntityListViewProps<EntityType.TonJetton> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonJetton}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonJetton })}
		<EntityView
			entityType={EntityType.TonJetton}
			entitySelector={tonJetton[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				TON jetton
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
