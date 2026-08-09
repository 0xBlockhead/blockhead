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
		title = 'Blockhead Litecoin MWEB output state observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.BlockheadLitecoinMwebOutputState_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadLitecoinMwebOutputState_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					spent: true,
					confirmations: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: blockheadLitecoinMwebOutputStateTimestamp })}
		{@const blockheadLitecoinMwebOutputStateTimestampSelector = blockheadLitecoinMwebOutputStateTimestamp[EntityMetaKey.Selector]}
		{@const outputState = blockheadLitecoinMwebOutputStateTimestampSelector.$outputState}
		<EntityView
			entityType={EntityType.BlockheadLitecoinMwebOutputState_Timestamp}
			entitySelector={blockheadLitecoinMwebOutputStateTimestampSelector}
			href={
				resolve(
					'/~/litecoin-mweb/wallet/[walletId=stringSegment]/output-state/[commitment=stringSegment]/(blockheadLitecoinMwebOutputState)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						walletId: outputState.walletId,
						commitment: outputState.commitment,
						timestampMs: String(blockheadLitecoinMwebOutputStateTimestampSelector.timestampMs),
						source: blockheadLitecoinMwebOutputStateTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{blockheadLitecoinMwebOutputStateTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{blockheadLitecoinMwebOutputStateTimestamp.spent ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{blockheadLitecoinMwebOutputStateTimestamp.confirmations ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
