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
	}: EntityListViewProps<EntityType.TonNftTransfer> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonNftTransfer}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonNftTransfer })}
		<EntityView
			entityType={EntityType.TonNftTransfer}
			entitySelector={tonNftTransfer[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				TON NFT transfer
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
