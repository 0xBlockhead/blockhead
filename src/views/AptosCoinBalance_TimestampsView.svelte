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
	}: EntityListViewProps<EntityType.AptosCoinBalance_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.AptosCoinBalance_Timestamp}
	bind:open
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
				{aptosCoinBalanceTimestamp.amount + aptosCoinBalanceTimestamp.unit}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{aptosCoinBalanceTimestampSelector.ledgerVersion}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
