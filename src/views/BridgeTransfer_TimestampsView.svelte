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
			fields: {
				timestampMs: true,
				status: true,
				substatus: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: bridgeTransferTimestamp })}
		{@const bridgeTransferTimestampSelector = bridgeTransferTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.BridgeTransfer_Timestamp}
			entitySelector={bridgeTransferTimestampSelector}
		>
			{#snippet Title()}
				{String(bridgeTransferTimestampSelector.timestampMs) || 'bridge transfer timestamp'}
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
