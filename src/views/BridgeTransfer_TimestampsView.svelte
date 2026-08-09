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
	}: EntityListViewProps<EntityType.BridgeTransfer_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BridgeTransfer_Timestamp}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					status: true,
					substatus: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: bridgeTransferTimestamp })}
		{@const bridgeTransferTimestampSelector = bridgeTransferTimestamp[EntityMetaKey.Selector]}
		{@const transfer = bridgeTransferTimestampSelector.$transfer}
		<EntityView
			entityType={EntityType.BridgeTransfer_Timestamp}
			entitySelector={bridgeTransferTimestampSelector}
			href={
				'originChainId' in transfer
				&& 'depositId' in transfer ?
					resolve(
						'/~/bridge/transfer/across/[originChainId=nonNegativeInteger]/[depositId=nonNegativeInteger]/(bridgeTransfer)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							originChainId: String(transfer.originChainId),
							depositId: String(transfer.depositId),
							timestampMs: String(bridgeTransferTimestampSelector.timestampMs),
							source: bridgeTransferTimestampSelector.source,
						}
					)
				:
					undefined
			}
		>
			{#snippet Title()}
				{bridgeTransferTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[(bridgeTransferTimestamp.status ?? ''), (bridgeTransferTimestamp.substatus ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{bridgeTransferTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
