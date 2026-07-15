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
		sources: [
			Source.BitcoinCashNode_JsonRpc,
		],
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
	href={
		href ?? (pendingEntity.$output !== undefined && pendingEntity.$output.indexInTransaction !== undefined && pendingEntity.$output.$transaction !== undefined && pendingEntity.$output.$transaction.txId !== undefined && pendingEntity.$output.$transaction.$network !== undefined && pendingEntity.$output.$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]/cash-token/nft', {
			outputIndex: String(pendingEntity.$output.indexInTransaction ?? ''),
			transactionId: String(pendingEntity.$output.$transaction.txId ?? ''),
			network: String(caip2StringFromValue(pendingEntity.$output.$transaction.$network.caip2) ?? ''),
		}) : pendingEntity.$output !== undefined && pendingEntity.$output.indexInTransaction !== undefined && pendingEntity.$output.$transaction !== undefined && pendingEntity.$output.$transaction.txId !== undefined && pendingEntity.$output.$transaction.$network !== undefined && pendingEntity.$output.$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]/cash-token/nft', {
			outputIndex: String(pendingEntity.$output.indexInTransaction ?? ''),
			transactionId: String(pendingEntity.$output.$transaction.txId ?? ''),
			network: String(pendingEntity.$output.$transaction.$network.slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={bitcoinCashCashTokenNft}>
			{#snippet Pending()}
				{[String((pendingEntity.capability) ?? '')].filter(Boolean).join(' ') || title || 'Bitcoin Cash CashToken NFT'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.capability) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bitcoinCashCashTokenNft}>
			{#snippet Pending()}
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
						<BitcoinCashCashTokenCategoryView
							selection={select(EntityType.BitcoinCashCashTokenCategory, bitcoinCashCashTokenCategory[EntityMetaKey.Selector])}
							prefetched={bitcoinCashCashTokenCategory}
							layout={EntityLayout.Value}
							open={false}
						/>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

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
						<BitcoinCashCashTokenCategoryView
							selection={select(EntityType.BitcoinCashCashTokenCategory, bitcoinCashCashTokenCategory[EntityMetaKey.Selector])}
							prefetched={bitcoinCashCashTokenCategory}
							layout={EntityLayout.Value}
							open={false}
						/>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={bitcoinCashCashTokenNft}>
			{#snippet Pending()}
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
									href={
										(bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.indexInTransaction !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.txId !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.$network !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]/cash-token/nft/commitment', {
											outputIndex: String(bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.indexInTransaction ?? ''),
											transactionId: String(bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.txId ?? ''),
											network: String(caip2StringFromValue(bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.$network.caip2) ?? ''),
										}) : bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.indexInTransaction !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.txId !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.$network !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]/cash-token/nft/commitment', {
											outputIndex: String(bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.indexInTransaction ?? ''),
											transactionId: String(bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.txId ?? ''),
											network: String(bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.$network.slug ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

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
									href={
										(bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.indexInTransaction !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.txId !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.$network !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]/cash-token/nft/commitment', {
											outputIndex: String(bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.indexInTransaction ?? ''),
											transactionId: String(bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.txId ?? ''),
											network: String(caip2StringFromValue(bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.$network.caip2) ?? ''),
										}) : bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.indexInTransaction !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.txId !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.$network !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]/cash-token/nft/commitment', {
											outputIndex: String(bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.indexInTransaction ?? ''),
											transactionId: String(bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.txId ?? ''),
											network: String(bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.$network.slug ?? ''),
										}) : undefined)
									}
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
				<dt>Capability</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: [
									Source.BitcoinCashNode_JsonRpc,
								],
								fields: {
									capability: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const capability = pendingEntity.capability}
							{#if capability !== undefined && capability !== null}
								{String((capability) ?? '')}
							{/if}
						{/snippet}

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
				{#snippet Pending()}{/snippet}

				{#snippet children(bitcoinCashCashTokenCommitment)}
					{#if bitcoinCashCashTokenCommitment != null && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector] != null}
						<div>
							<dt>Commitment</dt>
							<dd>
								<BitcoinCashCashTokenCommitmentView
									selection={select(EntityType.BitcoinCashCashTokenCommitment, bitcoinCashCashTokenCommitment[EntityMetaKey.Selector])}
									prefetched={bitcoinCashCashTokenCommitment}
									href={
										(bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.indexInTransaction !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.txId !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.$network !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]/cash-token/nft/commitment', {
											outputIndex: String(bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.indexInTransaction ?? ''),
											transactionId: String(bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.txId ?? ''),
											network: String(caip2StringFromValue(bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.$network.caip2) ?? ''),
										}) : bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.indexInTransaction !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.txId !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.$network !== undefined && bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]/cash-token/nft/commitment', {
											outputIndex: String(bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.indexInTransaction ?? ''),
											transactionId: String(bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.txId ?? ''),
											network: String(bitcoinCashCashTokenCommitment[EntityMetaKey.Selector].$output.$transaction.$network.slug ?? ''),
										}) : undefined)
									}
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
