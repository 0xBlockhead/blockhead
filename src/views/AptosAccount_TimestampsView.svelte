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
	}: EntityListViewProps<EntityType.AptosAccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosAccount_Timestamp}
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
	{#snippet Item({ item: aptosAccountTimestamp })}
		{@const aptosAccountTimestampSelector = aptosAccountTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AptosAccount_Timestamp}
			entitySelector={aptosAccountTimestampSelector}
		>
			{#snippet Title()}
				{String(aptosAccountTimestampSelector.ledgerVersion) || 'aptos account timestamp'}
			{/snippet}

			{#snippet Value()}
				{String(aptosAccountTimestamp.timestampMs ?? '')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aptosAccountTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
