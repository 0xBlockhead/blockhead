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
	}: EntityListViewProps<EntityType.AptosTableItem> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosTableItem}
	bind:open
	resource={
		selection({
			fields: {
				keyHash: true,
				keyType: true,
				valueType: true,
			},
		})
	}
>
	{#snippet Item({ item: aptosTableItem })}
		{@const aptosTableItemSelector = aptosTableItem[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AptosTableItem}
			entitySelector={aptosTableItemSelector}
		>
			{#snippet Title()}
				{aptosTableItemSelector.keyHash || 'aptos table item'}
			{/snippet}

			{#snippet Value()}
				{[(aptosTableItem.keyType ?? ''), (aptosTableItem.valueType ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
