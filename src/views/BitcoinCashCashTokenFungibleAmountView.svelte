<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	// State
	let {
		selector,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.BitcoinCashCashTokenFungibleAmount>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	


	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.BitcoinCashCashTokenFungibleAmount}
	entitySelector={selector}
	title={'Bitcoin Cash CashToken Fungible Amount'}
	bind:open
	{...EntityViewProps}
>

	{#snippet Title()}
		Bitcoin Cash CashToken Fungible Amount
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary
			resource={proxy(EntityType.BitcoinCashCashTokenFungibleAmount, selector, ({ fields: { amount: true } }))}
			placeholderText={`Loading Bitcoin Cash CashToken Fungible Amount...`}
		>
			{#snippet children(bitcoinCashCashTokenFungibleAmount)}
				<dl>
					{#if bitcoinCashCashTokenFungibleAmount.fields.amount != null}
						<div>
							<dt>Amount</dt>
							<dd><NumberValue value={bitcoinCashCashTokenFungibleAmount.fields.amount} /></dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
