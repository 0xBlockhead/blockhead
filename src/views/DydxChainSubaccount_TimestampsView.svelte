<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'dYdX chain subaccount observations',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.DydxChainSubaccount_Timestamp> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.DydxChainSubaccount_Timestamp}
	{title}
	bind:open
	resource={
		selection({
			...{
				fields: {
					timestampMs: true,
					$subaccount: true,
				},
			},
		})
	}
>
	{#snippet Item({ item: dydxChainSubaccountTimestamp })}
		{@const dydxChainSubaccountTimestampSelector = dydxChainSubaccountTimestamp[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.DydxChainSubaccount_Timestamp}
			entitySelector={dydxChainSubaccountTimestampSelector}
		>
			{#snippet Title()}
				{dydxChainSubaccountTimestampSelector.timestampMs}
			{/snippet}

			{#snippet Value()}
				{dydxChainSubaccountTimestampSelector.$subaccount.$account.address || 'Cosmos account'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
