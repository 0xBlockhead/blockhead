<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	let {
		entityId,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.BitcoinCashCashTokenFungibleAmount>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const bitcoinCashCashTokenFungibleAmount = useEntity(
		EntityType.BitcoinCashCashTokenFungibleAmount,
		entityId,
		{
			amount: {},
		},
	)


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.BitcoinCashCashTokenFungibleAmount}
	{entityId}
	title={'Bitcoin Cash CashToken Fungible Amount'}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		Bitcoin Cash CashToken Fungible Amount
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={bitcoinCashCashTokenFungibleAmount}
			placeholderText={`Loading Bitcoin Cash CashToken Fungible Amount...`}
		>
			{#snippet children(bitcoinCashCashTokenFungibleAmount)}
				<dl>
					{#if bitcoinCashCashTokenFungibleAmount.amount != null}
						<div>
							<dt>Amount</dt>
							<dd><NumberValue value={bitcoinCashCashTokenFungibleAmount.amount} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
