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
	}: EntityListViewProps<EntityType.BridgeTransfer> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BridgeTransfer}
	bind:open
	resource={
		selection({
			fields: {
				transferId: true,
				source: true,
				railId: true,
			},
		})
	}
>
	{#snippet Item({ item: bridgeTransfer })}
		{@const bridgeTransferSelector = bridgeTransfer[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BridgeTransfer}
			entitySelector={bridgeTransferSelector}
		>
			{#snippet Title()}
				{bridgeTransfer.transferId || 'bridge transfer'}
			{/snippet}

			{#snippet Value()}
				{[bridgeTransferSelector.source, (bridgeTransfer.railId ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
