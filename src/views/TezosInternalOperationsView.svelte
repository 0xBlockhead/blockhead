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
	}: EntityListViewProps<EntityType.TezosInternalOperation> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosInternalOperation}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosInternalOperation })}
		<EntityView
			entityType={EntityType.TezosInternalOperation}
			entitySelector={tezosInternalOperation[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				tezos internal operation
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
