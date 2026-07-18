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
			selection: RegisteredEntityProxyResource<EntityType.LitecoinMwebPegIn>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.LitecoinMwebPegIn>>
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
	const litecoinMwebPegIn = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived('litecoin MWEB peg in')
	const viewDomId = $derived('litecoin-mweb-peg-in-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LitecoinMwebTransactionView from '$/views/LitecoinMwebTransactionView.svelte'
	import UtxoOutputView from '$/views/UtxoOutputView.svelte'
</script>


<EntityView
	entityType={EntityType.LitecoinMwebPegIn}
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
					<LitecoinMwebTransactionView
						selection={select(EntityType.LitecoinMwebTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Title}
						open={false}
					/>
		{:else}
			<ResourceBoundary resource={litecoinMwebPegIn}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<LitecoinMwebTransactionView
						selection={select(EntityType.LitecoinMwebTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const pegInIndex0 = pendingEntity.pegInIndex}
					{#if pegInIndex0 !== undefined && pegInIndex0 !== null}
						<NumberValue
							value={pegInIndex0}
						/>
					{/if}
		{:else}
			<ResourceBoundary resource={litecoinMwebPegIn}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pegInIndex0 = resolvedEntity.pegInIndex}
					{#if pegInIndex0 !== undefined && pegInIndex0 !== null}
						<NumberValue
							value={pegInIndex0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			<ResourceBoundary
				resource={selection.$transparentOutput}
			>
				{#snippet children(utxoOutput)}
					{#if utxoOutput != null && utxoOutput[EntityMetaKey.Selector] != null}
						<span data-text="muted">
							<UtxoOutputView
								selection={select(EntityType.UtxoOutput, utxoOutput[EntityMetaKey.Selector])}
								prefetched={utxoOutput}
								href={
									(utxoOutput[EntityMetaKey.Selector].indexInTransaction !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.txId !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
										outputIndex: String(utxoOutput[EntityMetaKey.Selector].indexInTransaction ?? ''),
										transactionId: String(utxoOutput[EntityMetaKey.Selector].$transaction.txId ?? ''),
										network: String(caip2StringFromValue(utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2) ?? ''),
									}) : utxoOutput[EntityMetaKey.Selector].indexInTransaction !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.txId !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
										outputIndex: String(utxoOutput[EntityMetaKey.Selector].indexInTransaction ?? ''),
										transactionId: String(utxoOutput[EntityMetaKey.Selector].$transaction.txId ?? ''),
										network: String(utxoOutput[EntityMetaKey.Selector].$transaction.$network.slug ?? ''),
									}) : undefined)
								}
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
			<ResourceBoundary resource={litecoinMwebPegIn}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ResourceBoundary
						resource={selection.$transparentOutput}
					>
						{#snippet children(utxoOutput)}
							{#if utxoOutput != null && utxoOutput[EntityMetaKey.Selector] != null}
								<span data-text="muted">
									<UtxoOutputView
										selection={select(EntityType.UtxoOutput, utxoOutput[EntityMetaKey.Selector])}
										prefetched={utxoOutput}
										href={
											(utxoOutput[EntityMetaKey.Selector].indexInTransaction !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.txId !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
												outputIndex: String(utxoOutput[EntityMetaKey.Selector].indexInTransaction ?? ''),
												transactionId: String(utxoOutput[EntityMetaKey.Selector].$transaction.txId ?? ''),
												network: String(caip2StringFromValue(utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2) ?? ''),
											}) : utxoOutput[EntityMetaKey.Selector].indexInTransaction !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.txId !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
												outputIndex: String(utxoOutput[EntityMetaKey.Selector].indexInTransaction ?? ''),
												transactionId: String(utxoOutput[EntityMetaKey.Selector].$transaction.txId ?? ''),
												network: String(utxoOutput[EntityMetaKey.Selector].$transaction.$network.slug ?? ''),
											}) : undefined)
										}
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
				<dt>transaction</dt>
				<dd>
					<LitecoinMwebTransactionView
						selection={select(EntityType.LitecoinMwebTransaction, selection.entitySelector.$transaction, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>peg in index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									pegInIndex: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const pegInIndex = resolvedEntity.pegInIndex}
							{#if pegInIndex !== undefined && pegInIndex !== null}
								<NumberValue
									value={pegInIndex}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$transparentOutput}
			>
				{#snippet children(utxoOutput)}
					{#if utxoOutput != null && utxoOutput[EntityMetaKey.Selector] != null}
						<div>
							<dt>transparent output</dt>
							<dd>
								<UtxoOutputView
									selection={select(EntityType.UtxoOutput, utxoOutput[EntityMetaKey.Selector])}
									prefetched={utxoOutput}
									href={
										(utxoOutput[EntityMetaKey.Selector].indexInTransaction !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.txId !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
											outputIndex: String(utxoOutput[EntityMetaKey.Selector].indexInTransaction ?? ''),
											transactionId: String(utxoOutput[EntityMetaKey.Selector].$transaction.txId ?? ''),
											network: String(caip2StringFromValue(utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2) ?? ''),
										}) : utxoOutput[EntityMetaKey.Selector].indexInTransaction !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.txId !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
											outputIndex: String(utxoOutput[EntityMetaKey.Selector].indexInTransaction ?? ''),
											transactionId: String(utxoOutput[EntityMetaKey.Selector].$transaction.txId ?? ''),
											network: String(utxoOutput[EntityMetaKey.Selector].$transaction.$network.slug ?? ''),
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

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							amountLitoshis: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amountLitoshis = resolvedEntity.amountLitoshis}
					{#if amountLitoshis !== undefined && amountLitoshis !== null}
						<div>
							<dt>amount litoshis</dt>
							<dd>
								<NumberValue
									value={amountLitoshis}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
