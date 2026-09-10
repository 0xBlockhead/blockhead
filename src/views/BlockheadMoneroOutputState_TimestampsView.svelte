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
		title = 'Blockhead Monero output state observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadMoneroOutputState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadMoneroOutputState_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				spent: true,
				unlocked: true,
				confirmations: true,
			},
		})
	}
>
	{#snippet Item({ item: blockheadMoneroOutputStateTimestamp })}
		{@const blockheadMoneroOutputStateTimestampSelector = blockheadMoneroOutputStateTimestamp[EntityMetaKey.Selector]}
		{@const outputState = blockheadMoneroOutputStateTimestampSelector.$outputState}
		<EntityView
			entityType={EntityType.BlockheadMoneroOutputState_Timestamp}
			entitySelector={blockheadMoneroOutputStateTimestampSelector}
			href={
				resolve(
					'/~/monero/wallet/[walletId=stringSegment]/output-state/[txHash=stringSegment]/[outputIndex=nonNegativeInteger]/(blockheadMoneroOutputState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						walletId: outputState.walletId,
						txHash: outputState.txHash,
						outputIndex: String(outputState.outputIndex),
						timestampMs: String(blockheadMoneroOutputStateTimestampSelector.timestampMs),
						source: blockheadMoneroOutputStateTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadMoneroOutputStateTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[String(blockheadMoneroOutputStateTimestamp.spent ?? ''), String(blockheadMoneroOutputStateTimestamp.unlocked ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadMoneroOutputStateTimestamp.confirmations ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
