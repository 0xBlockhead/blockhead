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
	}: EntityListViewProps<EntityType.TezosTokenTransfer> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TezosTokenTransfer}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tezosTokenTransfer })}
		<EntityView
			entityType={EntityType.TezosTokenTransfer}
			entitySelector={tezosTokenTransfer[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				tezos token transfer
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
