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
	}: EntityListViewProps<EntityType.TezosOperation> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosOperation}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosOperation })}
		<EntityView
			entityType={EntityType.TezosOperation}
			entitySelector={tezosOperation[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				tezos operation
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
