<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.BitcoinCashCashTokenNft>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BitcoinCashCashTokenNft>>
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
	const bitcoinCashCashTokenNft = $derived(selection({
		sources: selection.sources,
		fields: {
			capability: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.capability) ?? '')].filter(Boolean).join(' ') || 'Bitcoin Cash CashToken NFT')
	const viewDomId = $derived('bitcoin-cash-cash-token-nft-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BitcoinCashCashTokenCategoryView from '$/views/BitcoinCashCashTokenCategoryView.svelte'
	import BitcoinCashCashTokenCommitmentView from '$/views/BitcoinCashCashTokenCommitmentView.svelte'
	import UtxoOutputView from '$/views/UtxoOutputView.svelte'
</script>


<EntityView
	entityType={EntityType.BitcoinCashCashTokenNft}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.capability) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={bitcoinCashCashTokenNft}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.capability) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<ResourceBoundary
						resource={
						selection.$category({
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
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
		{:else}
			<ResourceBoundary resource={bitcoinCashCashTokenNft}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ResourceBoundary
						resource={
						selection.$category({
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
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			<ResourceBoundary
				resource={
					selection.$commitment({
						sources: [
							Source.BitcoinCashNode_JsonRpc,
						],
					})
				}
			>
				{#snippet children(bitcoinCashCashTokenCommitment)}
					{#if bitcoinCashCashTokenCommitment != null && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector] != null}
						<span data-text="muted">
							<BitcoinCashCashTokenCommitmentView
								selection={select(EntityType.BitcoinCashCashTokenCommitment, bitcoinCashCashTokenCommitment[EntityMetaKey.Selector])}
								prefetched={bitcoinCashCashTokenCommitment}
								layout={EntityLayout.Title}
								open={false}
							/>
						</span>
					{:else}
						<span data-text="muted">Unavailable</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{:else}
			<ResourceBoundary resource={bitcoinCashCashTokenNft}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ResourceBoundary
						resource={
							selection.$commitment({
								sources: [
									Source.BitcoinCashNode_JsonRpc,
								],
							})
						}
					>
						{#snippet children(bitcoinCashCashTokenCommitment)}
							{#if bitcoinCashCashTokenCommitment != null && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector] != null}
								<span data-text="muted">
									<BitcoinCashCashTokenCommitmentView
										selection={select(EntityType.BitcoinCashCashTokenCommitment, bitcoinCashCashTokenCommitment[EntityMetaKey.Selector])}
										prefetched={bitcoinCashCashTokenCommitment}
										layout={EntityLayout.Title}
										open={false}
									/>
								</span>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Capability</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									capability: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const capability = resolvedEntity.capability}
							{#if capability !== undefined && capability !== null}
								{String((capability) ?? '')}
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
							selection.$category({
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

			<ResourceBoundary
				resource={
					selection.$commitment({
						sources: [
							Source.BitcoinCashNode_JsonRpc,
						],
					})
				}
			>
				{#snippet children(bitcoinCashCashTokenCommitment)}
					{#if bitcoinCashCashTokenCommitment != null && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector] != null}
						<div>
							<dt>Commitment</dt>
							<dd>
								<BitcoinCashCashTokenCommitmentView
									selection={select(EntityType.BitcoinCashCashTokenCommitment, bitcoinCashCashTokenCommitment[EntityMetaKey.Selector])}
									prefetched={bitcoinCashCashTokenCommitment}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Output</dt>
				<dd>
					<UtxoOutputView
						selection={select(EntityType.UtxoOutput, selection.entitySelector.$output, {})}
						href={
							(selection.entitySelector.$output.indexInTransaction !== undefined && selection.entitySelector.$output.$transaction !== undefined && selection.entitySelector.$output.$transaction.txId !== undefined && selection.entitySelector.$output.$transaction.$network !== undefined && selection.entitySelector.$output.$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
								outputIndex: String(selection.entitySelector.$output.indexInTransaction ?? ''),
								transactionId: String(selection.entitySelector.$output.$transaction.txId ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$output.$transaction.$network.caip2) ?? ''),
							}) : selection.entitySelector.$output.indexInTransaction !== undefined && selection.entitySelector.$output.$transaction !== undefined && selection.entitySelector.$output.$transaction.txId !== undefined && selection.entitySelector.$output.$transaction.$network !== undefined && selection.entitySelector.$output.$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
								outputIndex: String(selection.entitySelector.$output.indexInTransaction ?? ''),
								transactionId: String(selection.entitySelector.$output.$transaction.txId ?? ''),
								network: String(selection.entitySelector.$output.$transaction.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
