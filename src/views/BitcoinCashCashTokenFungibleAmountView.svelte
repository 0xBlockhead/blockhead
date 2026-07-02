<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { networkByCaip2 } from '$/constants/Network.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BitcoinCashCashTokenFungibleAmount>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BitcoinCashCashTokenFungibleAmount>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const bitcoinCashCashTokenFungibleAmount = $derived(selection({
		fields: {
			amount: true,
			$category: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).amount) ?? '')].filter(Boolean).join(' ') || 'Bitcoin Cash CashToken fungible amount')
	const viewDomId = $derived('bitcoin-cash-cash-token-fungible-amount-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import UtxoOutputView from '$/views/UtxoOutputView.svelte'
	import BitcoinCashCashTokenCategoryView from '$/views/BitcoinCashCashTokenCategoryView.svelte'
</script>


<EntityView
	entityType={EntityType.BitcoinCashCashTokenFungibleAmount}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/output/[outputIndex=nonNegativeInteger]/cash-token/fungible-amount', {
			networkSlug: String(networkByCaip2[String(({ ...selection.entitySelector, ...prefetched }).$output.$transaction.$network.caip2)].slug),
			txId: String(({ ...selection.entitySelector, ...prefetched }).$output.$transaction.txId),
			outputIndex: String(({ ...selection.entitySelector, ...prefetched }).$output.indexInTransaction),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const amount0 = ({ ...selection.entitySelector, ...prefetched }).amount}
			{#if amount0 !== undefined && amount0 !== null}
				<NumberValue value={Number(amount0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={bitcoinCashCashTokenFungibleAmount}>
				{#snippet Pending()}
					{@const amount0 = ({ ...selection.entitySelector, ...prefetched }).amount}
					{#if amount0 !== undefined && amount0 !== null}
						<NumberValue value={Number(amount0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const amount0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).amount}
					{#if amount0 !== undefined && amount0 !== null}
						<NumberValue value={Number(amount0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const amount0 = ({ ...selection.entitySelector, ...prefetched }).amount}
			{#if amount0 !== undefined && amount0 !== null}
				<NumberValue value={Number(amount0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={bitcoinCashCashTokenFungibleAmount}>
				{#snippet Pending()}
					{@const amount0 = ({ ...selection.entitySelector, ...prefetched }).amount}
					{#if amount0 !== undefined && amount0 !== null}
						<NumberValue value={Number(amount0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const amount0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).amount}
					{#if amount0 !== undefined && amount0 !== null}
						<NumberValue value={Number(amount0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.BitcoinCashCashTokenCategory, false>('$category')}
			>
				{#snippet children(bitcoinCashCashTokenCategory)}
					<span data-text="muted">
						<BitcoinCashCashTokenCategoryView
							selection={select(EntityType.BitcoinCashCashTokenCategory, bitcoinCashCashTokenCategory.entitySelector)}
							prefetched={bitcoinCashCashTokenCategory}
							href={
								resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/cash-token/category/[categoryId]', {
									networkSlug: String(bitcoinCashCashTokenCategory.entitySelector.$network.slug),
									categoryId: String(bitcoinCashCashTokenCategory.entitySelector.categoryId),
								})
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}
			</ResourceBoundary>
		{:else}
			<ResourceBoundary resource={bitcoinCashCashTokenFungibleAmount}>
				{#snippet Pending()}
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.BitcoinCashCashTokenCategory, false>('$category')}
					>
						{#snippet children(bitcoinCashCashTokenCategory)}
							<span data-text="muted">
								<BitcoinCashCashTokenCategoryView
									selection={select(EntityType.BitcoinCashCashTokenCategory, bitcoinCashCashTokenCategory.entitySelector)}
									prefetched={bitcoinCashCashTokenCategory}
									href={
										resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/cash-token/category/[categoryId]', {
											networkSlug: String(bitcoinCashCashTokenCategory.entitySelector.$network.slug),
											categoryId: String(bitcoinCashCashTokenCategory.entitySelector.categoryId),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet children(entity)}
					<ResourceBoundary
						resource={selection[EntityProxyField]<EntityType.BitcoinCashCashTokenCategory, false>('$category')}
					>
						{#snippet children(bitcoinCashCashTokenCategory)}
							<span data-text="muted">
								<BitcoinCashCashTokenCategoryView
									selection={select(EntityType.BitcoinCashCashTokenCategory, bitcoinCashCashTokenCategory.entitySelector)}
									prefetched={bitcoinCashCashTokenCategory}
									href={
										resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/cash-token/category/[categoryId]', {
											networkSlug: String(bitcoinCashCashTokenCategory.entitySelector.$network.slug),
											categoryId: String(bitcoinCashCashTokenCategory.entitySelector.categoryId),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Output</dt>
				<dd>
					<UtxoOutputView
						selection={select(EntityType.UtxoOutput, selection.entitySelector.$output)}
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/output/[outputIndex=nonNegativeInteger]', {
								networkSlug: String(networkByCaip2[String(selection.entitySelector.$output.$transaction.$network.caip2)].slug),
								txId: String(selection.entitySelector.$output.$transaction.txId),
								outputIndex: String(selection.entitySelector.$output.indexInTransaction),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
