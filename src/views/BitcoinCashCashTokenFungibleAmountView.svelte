<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.BitcoinCashCashTokenFungibleAmount> = $props()

	const output = $derived(selection.entitySelector.$output)
	const bitcoinCashCashTokenFungibleAmount = $derived(selection({
		sources: selection.sources ?? [
			Source.BitcoinCashNode_JsonRpc,
		],
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
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxIdOrStringSegment]/(selection)/output/[outputIndex=nonNegativeInteger]/(selection)/cash-token-fungible',
				{
					network: (
						'caip2' in output.$transaction.$network ?
							caip2StringFromValue(output.$transaction.$network.caip2)
						:
							output.$transaction.$network.slug
					),
					transactionId: output.$transaction.txId,
					outputIndex: String(output.indexInTransaction),
				}
			)
		:
			href ?? undefined
	}
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
