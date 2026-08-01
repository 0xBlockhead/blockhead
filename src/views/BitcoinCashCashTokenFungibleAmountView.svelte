<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BitcoinCashCashTokenFungibleAmount> = $props()

	const bitcoinCashCashTokenFungibleAmount = $derived(selection({
		sources: selection.sources ?? [
			Source.BitcoinCashNode_JsonRpc,
		],
	})({
		fields: {
			amount: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BitcoinCashCashTokenCategoryView from '$/views/BitcoinCashCashTokenCategoryView.svelte'
	import UtxoOutputView from '$/views/UtxoOutputView.svelte'
</script>


<EntityView
	entityType={EntityType.BitcoinCashCashTokenFungibleAmount}
	entitySelector={selection.entitySelector}
	title={title ?? (String(prefetched.amount ?? '') || 'Bitcoin Cash CashToken fungible amount')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={bitcoinCashCashTokenFungibleAmount}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.amount}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bitcoinCashCashTokenFungibleAmount}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.amount}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$category}
		>
			{#snippet children(bitcoinCashCashTokenCategory)}
				<span data-text="muted">
					<BitcoinCashCashTokenCategoryView
						selection={select(EntityType.BitcoinCashCashTokenCategory, bitcoinCashCashTokenCategory[EntityMetaKey.Selector])}
						layout={EntityLayout.Title}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Amount</dt>
				<dd>
					<ResourceBoundary
						resource={bitcoinCashCashTokenFungibleAmount}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.amount}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Category</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$category}
					>
						{#snippet children(bitcoinCashCashTokenCategory)}
							<BitcoinCashCashTokenCategoryView
								selection={select(EntityType.BitcoinCashCashTokenCategory, bitcoinCashCashTokenCategory[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Output</dt>
				<dd>
					<UtxoOutputView
						selection={select(EntityType.UtxoOutput, selection.entitySelector.$output)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
