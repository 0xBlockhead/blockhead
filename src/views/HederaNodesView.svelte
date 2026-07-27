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
	}: EntityListViewProps<EntityType.HederaNode> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaNode}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaNode })}
		<EntityView
			entityType={EntityType.HederaNode}
			entitySelector={hederaNode[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				hedera node
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
