<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.KaspaAddressUtxo_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.KaspaAddressUtxo_Timestamp>>
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
	const kaspaAddressUtxoTimestamp = $derived(selection({
		sources: [
			Source.KaspaExplorer_Rest,
			Source.KaspaNode_Grpc,
			Source.KaspaNode_Rest,
			Source.KaspaNode_Wrpc,
		],
	}))
	const titleFallback = $derived('kaspa address UTXO timestamp')
	const viewDomId = $derived('kaspa-address-utxo-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		<ResourceBoundary resource={kaspaAddressUtxoTimestamp}>
			{#snippet Pending()}
				{title || 'kaspa address UTXO timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Address</dt>
				<dd>
					<KaspaAddressView
						selection={select(EntityType.KaspaAddress, selection.entitySelector.$address, {})}
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
								fields: {
									outpointTransactionId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const outpointTransactionId = pendingEntity.outpointTransactionId}
							{#if outpointTransactionId !== undefined && outpointTransactionId !== null}
								{String((outpointTransactionId) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									outpointIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const outpointIndex = pendingEntity.outpointIndex}
							{#if outpointIndex !== undefined && outpointIndex !== null}
								<NumberValue value={Number(outpointIndex)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const outpointIndex = resolvedEntity.outpointIndex}
							{#if outpointIndex !== undefined && outpointIndex !== null}
								<NumberValue value={Number(outpointIndex)} />
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
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = pendingEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

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
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = pendingEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

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
						fields: {
							amountSompi: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const amountSompi = pendingEntity.amountSompi}
					{#if amountSompi !== undefined && amountSompi !== null}
						<div>
							<dt>amount sompi</dt>
							<dd>
								<NumberValue value={Number(amountSompi)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amountSompi = resolvedEntity.amountSompi}
					{#if amountSompi !== undefined && amountSompi !== null}
						<div>
							<dt>amount sompi</dt>
							<dd>
								<NumberValue value={Number(amountSompi)} />
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
						fields: {
							blockDaaScore: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blockDaaScore = pendingEntity.blockDaaScore}
					{#if blockDaaScore !== undefined && blockDaaScore !== null}
						<div>
							<dt>block daa score</dt>
							<dd>
								<NumberValue value={Number(blockDaaScore)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockDaaScore = resolvedEntity.blockDaaScore}
					{#if blockDaaScore !== undefined && blockDaaScore !== null}
						<div>
							<dt>block daa score</dt>
							<dd>
								<NumberValue value={Number(blockDaaScore)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isCoinbase: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const isCoinbase = pendingEntity.isCoinbase}
					{#if isCoinbase !== undefined && isCoinbase !== null}
						<div>
							<dt>is coinbase</dt>
							<dd>
								{isCoinbase ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

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
				{#snippet Pending()}{/snippet}

				{#snippet children(utxoOutput)}
					{#if utxoOutput != null && utxoOutput[EntityMetaKey.Selector] != null}
						<div>
							<dt>output</dt>
							<dd>
								<UtxoOutputView
									selection={select(EntityType.UtxoOutput, utxoOutput[EntityMetaKey.Selector])}
									prefetched={utxoOutput}
									href={
										(utxoOutput[EntityMetaKey.Selector].$transaction !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.$network.slug !== undefined && utxoOutput[EntityMetaKey.Selector].$transaction.txId !== undefined && utxoOutput[EntityMetaKey.Selector].indexInTransaction !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
											network: String(utxoOutput[EntityMetaKey.Selector].$transaction.$network.slug ?? ''),
											transactionId: String(utxoOutput[EntityMetaKey.Selector].$transaction.txId ?? ''),
											outputIndex: String(utxoOutput[EntityMetaKey.Selector].indexInTransaction ?? ''),
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
				resource={selection.$spendingTransaction}
			>
				{#snippet Pending()}{/snippet}

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
