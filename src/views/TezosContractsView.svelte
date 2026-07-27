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
	}: EntityListViewProps<EntityType.TezosContract> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosContract}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosContract })}
		<EntityView
			entityType={EntityType.TezosContract}
			entitySelector={tezosContract[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				tezos contract
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
