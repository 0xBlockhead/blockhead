<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EvmError_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmError_Timestamp}
	bind:open
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Openchain_Rest,
			],
			fields: {
				signatures: true,
				timestampMs: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: evmErrorTimestamp })}
		{@const evmErrorTimestampSelector = evmErrorTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EvmError_Timestamp}
			entitySelector={evmErrorTimestampSelector}
			href={
				resolve(
					'/(explore)/(protocols)/evm/(evmProtocol)/(errors)/error/[hex=zeroExHex]/(evmError)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
					{
						hex: evmErrorTimestampSelector.$error.hex,
						timestampMs: String(evmErrorTimestampSelector.timestampMs),
						source: evmErrorTimestampSelector.source,
					}
				)
			}
		>
			{#snippet Title()}
				{evmErrorTimestamp.signatures.values.join(', ') || 'EVM error observation'}
			{/snippet}

			{#snippet Value()}
				{evmErrorTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{evmErrorTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
