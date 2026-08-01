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
	}: EntityListViewProps<EntityType.TonJetton_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.TonJetton_Timestamp}
	bind:open
	resource={selection()}
>
	{#snippet Item({ item: tonJettonTimestamp })}
		<EntityView
			entityType={EntityType.TonJetton_Timestamp}
			entitySelector={tonJettonTimestamp[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				TON jetton timestamp
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
