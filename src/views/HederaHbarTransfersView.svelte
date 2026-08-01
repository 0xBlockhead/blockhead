<!-- Generated from APP.ts. -->

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
	}: EntityListViewProps<EntityType.HederaHbarTransfer> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.HederaHbarTransfer}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: hederaHbarTransfer })}
		<EntityView
			entityType={EntityType.HederaHbarTransfer}
			entitySelector={hederaHbarTransfer[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				hedera HBAR transfer
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
