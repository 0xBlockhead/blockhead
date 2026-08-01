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
	}: EntityListViewProps<EntityType.TonJettonTransfer> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonJettonTransfer}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonJettonTransfer })}
		<EntityView
			entityType={EntityType.TonJettonTransfer}
			entitySelector={tonJettonTransfer[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				TON jetton transfer
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
