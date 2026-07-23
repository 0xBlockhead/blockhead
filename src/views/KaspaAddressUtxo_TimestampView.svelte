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
			selection: RegisteredEntityProxyResource<EntityType.KaspaAddressUtxo_Timestamp>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.KaspaAddressUtxo_Timestamp>
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
	const kaspaAddressUtxoTimestamp = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {},
	} : {
		sources: selection.sources,
	}))
	const titleFallback = 'kaspa address UTXO timestamp'
	const viewDomId = $derived('kaspa-address-utxo-timestamp-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import KaspaAddressView from '$/views/KaspaAddressView.svelte'
	import UtxoOutputView from '$/views/UtxoOutputView.svelte'
	import KaspaTransactionView from '$/views/KaspaTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.KaspaAddressUtxo_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails}
			{title || titleFallback}
		{:else}
			<ResourceBoundary resource={kaspaAddressUtxoTimestamp}>
				{#snippet children(entity)}
					{title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Address</dt>
				<dd>
					<KaspaAddressView
						selection={select(EntityType.KaspaAddress, selection.entitySelector.$address)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>outpoint transaction ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									outpointTransactionId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const outpointTransactionId = resolvedEntity.outpointTransactionId}
							{#if outpointTransactionId !== undefined && outpointTransactionId !== null}
								{String((outpointTransactionId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>outpoint index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									outpointIndex: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const outpointIndex = resolvedEntity.outpointIndex}
							{#if outpointIndex !== undefined && outpointIndex !== null}
								<NumberValue
									value={outpointIndex}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							amountSompi: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amountSompi = resolvedEntity.amountSompi}
					{#if amountSompi !== undefined && amountSompi !== null}
						<div>
							<dt>amount sompi</dt>
							<dd>
								<NumberValue
									value={amountSompi}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							blockDaaScore: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockDaaScore = resolvedEntity.blockDaaScore}
					{#if blockDaaScore !== undefined && blockDaaScore !== null}
						<div>
							<dt>block daa score</dt>
							<dd>
								<NumberValue
									value={blockDaaScore}
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
							isCoinbase: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const isCoinbase = resolvedEntity.isCoinbase}
					{#if isCoinbase !== undefined && isCoinbase !== null}
						<div>
							<dt>is coinbase</dt>
							<dd>
								{isCoinbase ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$output}
			>
				{#snippet children(utxoOutput)}
					{#if utxoOutput != null && utxoOutput[EntityMetaKey.Selector] != null}
						<div>
							<dt>output</dt>
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
				resource={selection.$spendingTransaction}
			>
				{#snippet children(kaspaTransaction)}
					{#if kaspaTransaction != null && kaspaTransaction[EntityMetaKey.Selector] != null}
						<div>
							<dt>spending transaction</dt>
							<dd>
								<KaspaTransactionView
									selection={select(EntityType.KaspaTransaction, kaspaTransaction[EntityMetaKey.Selector])}
									prefetched={kaspaTransaction}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
