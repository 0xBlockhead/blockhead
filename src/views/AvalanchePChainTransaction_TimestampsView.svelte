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
	}: EntityListViewProps<EntityType.AvalanchePChainTransaction_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AvalanchePChainTransaction_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				timestampMs: true,
				status: true,
				blockHeight: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: avalanchePChainTransactionTimestamp })}
		{@const avalanchePChainTransactionTimestampSelector = avalanchePChainTransactionTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AvalanchePChainTransaction_Timestamp}
			entitySelector={avalanchePChainTransactionTimestampSelector}
		>
			{#snippet Title()}
				{avalanchePChainTransactionTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{[(avalanchePChainTransactionTimestamp.status ?? ''), String(avalanchePChainTransactionTimestamp.blockHeight ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{avalanchePChainTransactionTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
