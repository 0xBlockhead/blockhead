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
	}: EntityListViewProps<EntityType.AptosNetwork_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosNetwork_Timestamp}
	bind:open
	resource={
		selection({
			fields: {
				ledgerVersion: true,
				blockHeight: true,
				timestampMs: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: aptosNetworkTimestamp })}
		{@const aptosNetworkTimestampSelector = aptosNetworkTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.AptosNetwork_Timestamp}
			entitySelector={aptosNetworkTimestampSelector}
		>
			{#snippet Title()}
				{aptosNetworkTimestampSelector.ledgerVersion}
			{/snippet}

			{#snippet Value()}
				{[String(aptosNetworkTimestamp.blockHeight ?? ''), String(aptosNetworkTimestamp.timestampMs ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aptosNetworkTimestampSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
