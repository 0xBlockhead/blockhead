<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.BitcoinCashCashTokenFungibleAmount>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.BitcoinCashCashTokenFungibleAmount>
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const bitcoinCashCashTokenFungibleAmount = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			amount: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			amount: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.amount) ?? '')].filter(Boolean).join(' ') || 'Bitcoin Cash CashToken fungible amount')
	const viewDomId = $derived('bitcoin-cash-cash-token-fungible-amount-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BitcoinCashCashTokenCategoryView from '$/views/BitcoinCashCashTokenCategoryView.svelte'
	import UtxoOutputView from '$/views/UtxoOutputView.svelte'
</script>


<EntityView
	entityType={EntityType.BitcoinCashCashTokenFungibleAmount}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={bitcoinCashCashTokenFungibleAmount}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const amount0 = resolvedEntity.amount}
				{#if amount0 !== undefined && amount0 !== null}
					<NumberValue
						value={amount0}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bitcoinCashCashTokenFungibleAmount}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const amount0 = resolvedEntity.amount}
				{#if amount0 !== undefined && amount0 !== null}
					<NumberValue
						value={amount0}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={bitcoinCashCashTokenFungibleAmount}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={
						selection
							.$category({
								sources: [
									Source.BitcoinCashNode_JsonRpc,
								],
							})
					}
				>
					{#snippet children(bitcoinCashCashTokenCategory)}
						{#if bitcoinCashCashTokenCategory != null && bitcoinCashCashTokenCategory[EntityMetaKey.Selector] != null}
						<span data-text="muted">
							<BitcoinCashCashTokenCategoryView
								selection={select(EntityType.BitcoinCashCashTokenCategory, bitcoinCashCashTokenCategory[EntityMetaKey.Selector])}
								prefetched={bitcoinCashCashTokenCategory}
								layout={EntityLayout.Title}
								open={false}
							/>
						</span>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Amount</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									amount: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const amount = resolvedEntity.amount}
							{#if amount !== undefined && amount !== null}
								<NumberValue
									value={amount}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Category</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection
								.$category({
									sources: [
										Source.BitcoinCashNode_JsonRpc,
									],
								})
						}
					>
						{#snippet children(bitcoinCashCashTokenCategory)}
							{#if bitcoinCashCashTokenCategory != null && bitcoinCashCashTokenCategory[EntityMetaKey.Selector] != null}
								<BitcoinCashCashTokenCategoryView
									selection={select(EntityType.BitcoinCashCashTokenCategory, bitcoinCashCashTokenCategory[EntityMetaKey.Selector])}
									prefetched={bitcoinCashCashTokenCategory}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Output</dt>
				<dd>
					<UtxoOutputView
						selection={select(EntityType.UtxoOutput, selection.entitySelector.$output)}
						href={
							(
								selection.entitySelector.$output != null && 'indexInTransaction' in selection.entitySelector.$output
								&& selection.entitySelector.$output.indexInTransaction != null
								&& selection.entitySelector.$output != null && '$transaction' in selection.entitySelector.$output
								&& selection.entitySelector.$output.$transaction != null && 'txId' in selection.entitySelector.$output.$transaction
								&& selection.entitySelector.$output.$transaction.txId != null
								&& selection.entitySelector.$output.$transaction != null && '$network' in selection.entitySelector.$output.$transaction ?
									selection.entitySelector.$output.$transaction.$network != null && 'caip2' in selection.entitySelector.$output.$transaction.$network
									&& selection.entitySelector.$output.$transaction.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
									outputIndex: String(selection.entitySelector.$output.indexInTransaction ?? ''),
									transactionId: String(selection.entitySelector.$output.$transaction.txId ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$output.$transaction.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$output.$transaction.$network != null && 'slug' in selection.entitySelector.$output.$transaction.$network
										&& selection.entitySelector.$output.$transaction.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
										outputIndex: String(selection.entitySelector.$output.indexInTransaction ?? ''),
										transactionId: String(selection.entitySelector.$output.$transaction.txId ?? ''),
										network: String(selection.entitySelector.$output.$transaction.$network.slug ?? ''),
									})
									:
										undefined
							:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
