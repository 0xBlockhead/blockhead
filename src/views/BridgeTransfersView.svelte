<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
				originChainId: true,
				depositId: true,
				transferId: true,
				source: true,
				railId: true,
			},
		})
	}
>
	{#snippet Item({ item: bridgeTransfer })}
		<EntityView
			entityType={EntityType.BridgeTransfer}
			entitySelector={bridgeTransfer[EntityMetaKey.Selector]}
			href={
				bridgeTransfer.originChainId != null
				&& bridgeTransfer.depositId != null ?
					resolve(
						'/bridge/transfer/across/[originChainId=nonNegativeInteger]/[depositId=nonNegativeInteger]',
						{
							originChainId: String(bridgeTransfer.originChainId),
							depositId: String(bridgeTransfer.depositId),
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{bridgeTransfer.transferId || 'bridge transfer'}
			{/snippet}

			{#snippet Value()}
				{[bridgeTransfer.source, (bridgeTransfer.railId ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
