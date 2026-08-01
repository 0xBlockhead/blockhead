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
	}: EntityListViewProps<EntityType.AptosTableItem_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosTableItem_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				ledgerVersion: true,
				timestampMs: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: aptosTableItemTimestamp })}
		{@const aptosTableItemTimestampSelector = aptosTableItemTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AptosTableItem_Timestamp}
			entitySelector={aptosTableItemTimestampSelector}
		>
			{#snippet Title()}
				{aptosTableItemTimestampSelector.ledgerVersion}
			{/snippet}

			{#snippet Value()}
				{aptosTableItemTimestamp.timestampMs ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aptosTableItemTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
