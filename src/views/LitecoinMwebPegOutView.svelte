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
			selection: RegisteredEntityProxyResource<EntityType.LitecoinMwebPegOut>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.LitecoinMwebPegOut>
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
	const litecoinMwebPegOut = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = 'litecoin MWEB peg out'
	const viewDomId = $derived('litecoin-mweb-peg-out-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LitecoinMwebTransactionView from '$/views/LitecoinMwebTransactionView.svelte'
	import UtxoOutputView from '$/views/UtxoOutputView.svelte'
</script>


<EntityView
	entityType={EntityType.LitecoinMwebPegOut}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={litecoinMwebPegOut}>
			{#snippet children(entity)}
				<LitecoinMwebTransactionView
					selection={select(EntityType.LitecoinMwebTransaction, selection.entitySelector.$transaction)}
					href=""
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={litecoinMwebPegOut}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const pegOutIndex0 = resolvedEntity.pegOutIndex}
				{#if pegOutIndex0 !== undefined && pegOutIndex0 !== null}
					<NumberValue
						value={pegOutIndex0}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={litecoinMwebPegOut}>
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
										(
											utxoOutput[EntityMetaKey.Selector] != null && 'indexInTransaction' in utxoOutput[EntityMetaKey.Selector]
											&& utxoOutput[EntityMetaKey.Selector].indexInTransaction != null
											&& utxoOutput[EntityMetaKey.Selector] != null && '$transaction' in utxoOutput[EntityMetaKey.Selector]
											&& utxoOutput[EntityMetaKey.Selector].$transaction != null && 'txId' in utxoOutput[EntityMetaKey.Selector].$transaction
											&& utxoOutput[EntityMetaKey.Selector].$transaction.txId != null
											&& utxoOutput[EntityMetaKey.Selector].$transaction != null && '$network' in utxoOutput[EntityMetaKey.Selector].$transaction ?
												utxoOutput[EntityMetaKey.Selector].$transaction.$network != null && 'caip2' in utxoOutput[EntityMetaKey.Selector].$transaction.$network
												&& utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
												outputIndex: String(utxoOutput[EntityMetaKey.Selector].indexInTransaction ?? ''),
												transactionId: String(utxoOutput[EntityMetaKey.Selector].$transaction.txId ?? ''),
												network: String(caip2StringFromValue(utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2) ?? ''),
											})
											:
													utxoOutput[EntityMetaKey.Selector].$transaction.$network != null && 'slug' in utxoOutput[EntityMetaKey.Selector].$transaction.$network
													&& utxoOutput[EntityMetaKey.Selector].$transaction.$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
													outputIndex: String(utxoOutput[EntityMetaKey.Selector].indexInTransaction ?? ''),
													transactionId: String(utxoOutput[EntityMetaKey.Selector].$transaction.txId ?? ''),
													network: String(utxoOutput[EntityMetaKey.Selector].$transaction.$network.slug ?? ''),
												})
												:
													undefined
										:
												undefined
										)
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
				<dt>transaction</dt>
				<dd>
					<LitecoinMwebTransactionView
						selection={select(EntityType.LitecoinMwebTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>peg out index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									pegOutIndex: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const pegOutIndex = resolvedEntity.pegOutIndex}
							{#if pegOutIndex !== undefined && pegOutIndex !== null}
								<NumberValue
									value={pegOutIndex}
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
										(
											utxoOutput[EntityMetaKey.Selector] != null && 'indexInTransaction' in utxoOutput[EntityMetaKey.Selector]
											&& utxoOutput[EntityMetaKey.Selector].indexInTransaction != null
											&& utxoOutput[EntityMetaKey.Selector] != null && '$transaction' in utxoOutput[EntityMetaKey.Selector]
											&& utxoOutput[EntityMetaKey.Selector].$transaction != null && 'txId' in utxoOutput[EntityMetaKey.Selector].$transaction
											&& utxoOutput[EntityMetaKey.Selector].$transaction.txId != null
											&& utxoOutput[EntityMetaKey.Selector].$transaction != null && '$network' in utxoOutput[EntityMetaKey.Selector].$transaction ?
												utxoOutput[EntityMetaKey.Selector].$transaction.$network != null && 'caip2' in utxoOutput[EntityMetaKey.Selector].$transaction.$network
												&& utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
												outputIndex: String(utxoOutput[EntityMetaKey.Selector].indexInTransaction ?? ''),
												transactionId: String(utxoOutput[EntityMetaKey.Selector].$transaction.txId ?? ''),
												network: String(caip2StringFromValue(utxoOutput[EntityMetaKey.Selector].$transaction.$network.caip2) ?? ''),
											})
											:
													utxoOutput[EntityMetaKey.Selector].$transaction.$network != null && 'slug' in utxoOutput[EntityMetaKey.Selector].$transaction.$network
													&& utxoOutput[EntityMetaKey.Selector].$transaction.$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
													outputIndex: String(utxoOutput[EntityMetaKey.Selector].indexInTransaction ?? ''),
													transactionId: String(utxoOutput[EntityMetaKey.Selector].$transaction.txId ?? ''),
													network: String(utxoOutput[EntityMetaKey.Selector].$transaction.$network.slug ?? ''),
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
