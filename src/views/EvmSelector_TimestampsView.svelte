<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EvmSelector_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmSelector_Timestamp}
	bind:open
	resource={
		selection({
			...{
				sources: selection.sources ?? [
					Source.Openchain_Rest,
				],
				fields: {
					signatures: true,
					timestampMs: true,
					source: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: evmSelectorTimestamp })}
		{@const evmSelectorTimestampSelector = evmSelectorTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EvmSelector_Timestamp}
			entitySelector={evmSelectorTimestampSelector}
		>
			{#snippet Title()}
				{evmSelectorTimestamp.signatures.values.join(', ') || 'EVM selector observation'}
			{/snippet}

			{#snippet Value()}
				{evmSelectorTimestampSelector.timestampMs}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{evmSelectorTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
