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
			selection: EntityProxyResource<typeof schema, EntityType.BitcoinCashCashTokenCommitment>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BitcoinCashCashTokenCommitment>>
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

	const bitcoinCashCashTokenCommitment = $derived(selection({
		fields: {
			commitmentHex: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).commitmentHex) ?? '')].filter(Boolean).join(' ') || 'Bitcoin Cash CashToken commitment')
	const viewDomId = $derived('bitcoin-cash-cash-token-commitment-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import UtxoOutputView from '$/views/UtxoOutputView.svelte'
</script>


<EntityView
	entityType={EntityType.BitcoinCashCashTokenCommitment}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/output/[outputIndex=nonNegativeInteger]/cash-token/nft/commitment', {
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
			{@const commitmentHex0 = ({ ...selection.entitySelector, ...prefetched }).commitmentHex}
			{#if commitmentHex0 !== undefined && commitmentHex0 !== null}
				<TruncatedValue value={String(commitmentHex0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={bitcoinCashCashTokenCommitment}>
				{#snippet Pending()}
					{@const commitmentHex0 = ({ ...selection.entitySelector, ...prefetched }).commitmentHex}
					{#if commitmentHex0 !== undefined && commitmentHex0 !== null}
						<TruncatedValue value={String(commitmentHex0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const commitmentHex0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).commitmentHex}
					{#if commitmentHex0 !== undefined && commitmentHex0 !== null}
						<TruncatedValue value={String(commitmentHex0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const commitmentHex0 = ({ ...selection.entitySelector, ...prefetched }).commitmentHex}
			{#if commitmentHex0 !== undefined && commitmentHex0 !== null}
				<TruncatedValue value={String(commitmentHex0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={bitcoinCashCashTokenCommitment}>
				{#snippet Pending()}
					{@const commitmentHex0 = ({ ...selection.entitySelector, ...prefetched }).commitmentHex}
					{#if commitmentHex0 !== undefined && commitmentHex0 !== null}
						<TruncatedValue value={String(commitmentHex0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const commitmentHex0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).commitmentHex}
					{#if commitmentHex0 !== undefined && commitmentHex0 !== null}
						<TruncatedValue value={String(commitmentHex0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<span data-text="muted">
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
			</span>
		{:else}
			<ResourceBoundary resource={bitcoinCashCashTokenCommitment}>
				{#snippet Pending()}
					<span data-text="muted">
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
					</span>
				{/snippet}

				{#snippet children(entity)}
					<span data-text="muted">
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
					</span>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntityView>
