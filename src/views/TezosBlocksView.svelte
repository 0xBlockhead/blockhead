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
	}: EntityListViewProps<EntityType.TezosBlock> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosBlock}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosBlock })}
		<EntityView
			entityType={EntityType.TezosBlock}
			entitySelector={tezosBlock[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				tezos block
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
