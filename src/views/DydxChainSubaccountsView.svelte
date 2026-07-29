<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'dYdX chain subaccounts',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.DydxChainSubaccount> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.DydxChainSubaccount}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				$account: true,
				subaccountNumber: true,
			},
		})
	}
>
	{#snippet Item({ item: dydxChainSubaccount })}
		{@const dydxChainSubaccountSelector = dydxChainSubaccount[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.DydxChainSubaccount}
			entitySelector={dydxChainSubaccountSelector}
		>
			{#snippet Title()}
				{dydxChainSubaccountSelector.$account.address || 'Cosmos account'}
			{/snippet}

			{#snippet Value()}
				{dydxChainSubaccountSelector.subaccountNumber}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
