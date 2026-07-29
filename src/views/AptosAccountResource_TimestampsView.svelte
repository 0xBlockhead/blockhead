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
	}: EntityListViewProps<EntityType.AptosAccountResource_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosAccountResource_Timestamp}
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
	{#snippet Item({ item: aptosAccountResourceTimestamp })}
		{@const aptosAccountResourceTimestampSelector = aptosAccountResourceTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AptosAccountResource_Timestamp}
			entitySelector={aptosAccountResourceTimestampSelector}
		>
			{#snippet Title()}
				{aptosAccountResourceTimestampSelector.ledgerVersion}
			{/snippet}

			{#snippet Value()}
				{aptosAccountResourceTimestamp.timestampMs ?? ''}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aptosAccountResourceTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
