<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'Allowance blocks',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.EvmActorCoinAllowance_Block> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmActorCoinAllowance_Block}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				blockNumber: true,
				allowance: true,
				source: true,
			},
		})
	}
>
	{#snippet Item({ item: evmActorCoinAllowanceBlock })}
		{@const evmActorCoinAllowanceBlockSelector = evmActorCoinAllowanceBlock[EntityMetaKey.Selector]}
		<EntityView
			entityType={EntityType.EvmActorCoinAllowance_Block}
			entitySelector={evmActorCoinAllowanceBlockSelector}
		>
			{#snippet Title()}
				{'Block ' + evmActorCoinAllowanceBlockSelector.blockNumber}
			{/snippet}

			{#snippet Value()}
				{evmActorCoinAllowanceBlock.allowance}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{evmActorCoinAllowanceBlockSelector.source}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
