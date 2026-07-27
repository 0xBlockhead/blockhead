<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		typeAnnotationParagraphs = ['A current balance reported by the Aptos Indexer, anchored to the row\'s last transaction version. This surface does not imply retained balance history.'],
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.AptosCoinBalance_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosCoinBalance_Timestamp}
	bind:open
	{typeAnnotationParagraphs}
	resource={
		selection({
			fields: {
				assetType: true,
				amount: true,
				ledgerVersion: true,
			},
		})
	}
>
	{#snippet Item({ item: aptosCoinBalanceTimestamp })}
		{@const aptosCoinBalanceTimestampSelector = aptosCoinBalanceTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AptosCoinBalance_Timestamp}
			entitySelector={aptosCoinBalanceTimestampSelector}
		>
			{#snippet Title()}
				{aptosCoinBalanceTimestamp.assetType || 'current Aptos coin balance observation'}
			{/snippet}

			{#snippet Value()}
				{(String(aptosCoinBalanceTimestamp.amount) ? String(aptosCoinBalanceTimestamp.amount) + aptosCoinBalanceTimestamp.unit : '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{String(aptosCoinBalanceTimestampSelector.ledgerVersion)}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
