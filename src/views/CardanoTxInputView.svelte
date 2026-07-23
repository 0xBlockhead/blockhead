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
			selection: RegisteredEntityProxyResource<EntityType.CardanoTxInput>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.CardanoTxInput>
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
	const cardanoTxInput = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			inputKind: true,
			spentTxHash: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			inputKind: true,
			spentTxHash: true,
		},
	}))
	const titleFallback = $derived([(String((pendingEntity.inputIndex) ?? '') ? 'Input ' + String((pendingEntity.inputIndex) ?? '') : '')].filter(Boolean).join(' ') || 'Cardano transaction input')
	const viewDomId = $derived('cardano-tx-input-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CardanoTransactionView from '$/views/CardanoTransactionView.svelte'
	import CardanoTxOutputView from '$/views/CardanoTxOutputView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoTxInput}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'inputIndex' in selection.entitySelector
			&& selection.entitySelector.inputIndex != null
			&& selection.entitySelector != null && '$transaction' in selection.entitySelector
			&& selection.entitySelector.$transaction != null && 'hash' in selection.entitySelector.$transaction
			&& selection.entitySelector.$transaction.hash != null
			&& selection.entitySelector.$transaction != null && '$network' in selection.entitySelector.$transaction ?
				selection.entitySelector.$transaction.$network != null && 'caip2' in selection.entitySelector.$transaction.$network
				&& selection.entitySelector.$transaction.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/input/[inputIndex=nonNegativeInteger]', {
				inputIndex: String(selection.entitySelector.inputIndex ?? ''),
				transactionId: String(selection.entitySelector.$transaction.hash ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$transaction.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$transaction.$network != null && 'slug' in selection.entitySelector.$transaction.$network
					&& selection.entitySelector.$transaction.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/input/[inputIndex=nonNegativeInteger]', {
					inputIndex: String(selection.entitySelector.inputIndex ?? ''),
					transactionId: String(selection.entitySelector.$transaction.hash ?? ''),
					network: String(selection.entitySelector.$transaction.$network.slug ?? ''),
				})
				:
					undefined
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'inputKind') && Object.hasOwn(prefetched, 'spentTxHash')}
			{@const inputIndex0 = pendingEntity.inputIndex}
			{#if inputIndex0 !== undefined && inputIndex0 !== null}
				<span>Input </span>
				<NumberValue
					value={inputIndex0}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={cardanoTxInput}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const inputIndex0 = resolvedEntity.inputIndex}
					{#if inputIndex0 !== undefined && inputIndex0 !== null}
						<span>Input </span>
						<NumberValue
							value={inputIndex0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'inputKind') && Object.hasOwn(prefetched, 'spentTxHash')}
			{[String((pendingEntity.inputKind) ?? '')].filter(Boolean).join(' ') || [(String((pendingEntity.inputIndex) ?? '') ? 'Input ' + String((pendingEntity.inputIndex) ?? '') : '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={cardanoTxInput}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.inputKind) ?? '')].filter(Boolean).join(' ') || [(String((resolvedEntity.inputIndex) ?? '') ? 'Input ' + String((resolvedEntity.inputIndex) ?? '') : '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'inputKind') && Object.hasOwn(prefetched, 'spentTxHash')}
			{@const spentTxHash0 = pendingEntity.spentTxHash}
			{#if spentTxHash0 !== undefined && spentTxHash0 !== null}
				<span data-text="muted">
					<TruncatedValue value={String((spentTxHash0) ?? '')} />
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={cardanoTxInput}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const spentTxHash0 = resolvedEntity.spentTxHash}
					{#if spentTxHash0 !== undefined && spentTxHash0 !== null}
						<span data-text="muted">
							<TruncatedValue value={String((spentTxHash0) ?? '')} />
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<CardanoTransactionView
						selection={select(EntityType.CardanoTransaction, selection.entitySelector.$transaction)}
						href={
							(
								selection.entitySelector.$transaction != null && 'hash' in selection.entitySelector.$transaction
								&& selection.entitySelector.$transaction.hash != null
								&& selection.entitySelector.$transaction != null && '$network' in selection.entitySelector.$transaction ?
									selection.entitySelector.$transaction.$network != null && 'caip2' in selection.entitySelector.$transaction.$network
									&& selection.entitySelector.$transaction.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
									transactionId: String(selection.entitySelector.$transaction.hash ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$transaction.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$transaction.$network != null && 'slug' in selection.entitySelector.$transaction.$network
										&& selection.entitySelector.$transaction.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
										transactionId: String(selection.entitySelector.$transaction.hash ?? ''),
										network: String(selection.entitySelector.$transaction.$network.slug ?? ''),
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

			<div>
				<dt>input index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									inputIndex: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const inputIndex = resolvedEntity.inputIndex}
							{#if inputIndex !== undefined && inputIndex !== null}
								<NumberValue
									value={inputIndex}
								/>
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
							inputKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const inputKind = resolvedEntity.inputKind}
					{#if inputKind !== undefined && inputKind !== null}
						<div>
							<dt>input kind</dt>
							<dd>
								{String((inputKind) ?? '')}
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
							spentTxHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const spentTxHash = resolvedEntity.spentTxHash}
					{#if spentTxHash !== undefined && spentTxHash !== null}
						<div>
							<dt>spent transaction hash</dt>
							<dd>
								<TruncatedValue value={String((spentTxHash) ?? '')} />
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
							spentOutputIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const spentOutputIndex = resolvedEntity.spentOutputIndex}
					{#if spentOutputIndex !== undefined && spentOutputIndex !== null}
						<div>
							<dt>spent output index</dt>
							<dd>
								<NumberValue
									value={spentOutputIndex}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$spentOutput}
			>
				{#snippet children(cardanoTxOutput)}
					{#if cardanoTxOutput != null && cardanoTxOutput[EntityMetaKey.Selector] != null}
						<div>
							<dt>spent output</dt>
							<dd>
								<CardanoTxOutputView
									selection={select(EntityType.CardanoTxOutput, cardanoTxOutput[EntityMetaKey.Selector])}
									prefetched={cardanoTxOutput}
									href={
										(
											cardanoTxOutput[EntityMetaKey.Selector] != null && 'outputIndex' in cardanoTxOutput[EntityMetaKey.Selector]
											&& cardanoTxOutput[EntityMetaKey.Selector].outputIndex != null
											&& cardanoTxOutput[EntityMetaKey.Selector] != null && '$transaction' in cardanoTxOutput[EntityMetaKey.Selector]
											&& cardanoTxOutput[EntityMetaKey.Selector].$transaction != null && 'hash' in cardanoTxOutput[EntityMetaKey.Selector].$transaction
											&& cardanoTxOutput[EntityMetaKey.Selector].$transaction.hash != null
											&& cardanoTxOutput[EntityMetaKey.Selector].$transaction != null && '$network' in cardanoTxOutput[EntityMetaKey.Selector].$transaction ?
												cardanoTxOutput[EntityMetaKey.Selector].$transaction.$network != null && 'caip2' in cardanoTxOutput[EntityMetaKey.Selector].$transaction.$network
												&& cardanoTxOutput[EntityMetaKey.Selector].$transaction.$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
												outputIndex: String(cardanoTxOutput[EntityMetaKey.Selector].outputIndex ?? ''),
												transactionId: String(cardanoTxOutput[EntityMetaKey.Selector].$transaction.hash ?? ''),
												network: String(caip2StringFromValue(cardanoTxOutput[EntityMetaKey.Selector].$transaction.$network.caip2) ?? ''),
											})
											:
													cardanoTxOutput[EntityMetaKey.Selector].$transaction.$network != null && 'slug' in cardanoTxOutput[EntityMetaKey.Selector].$transaction.$network
													&& cardanoTxOutput[EntityMetaKey.Selector].$transaction.$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/output/[outputIndex=nonNegativeInteger]', {
													outputIndex: String(cardanoTxOutput[EntityMetaKey.Selector].outputIndex ?? ''),
													transactionId: String(cardanoTxOutput[EntityMetaKey.Selector].$transaction.hash ?? ''),
													network: String(cardanoTxOutput[EntityMetaKey.Selector].$transaction.$network.slug ?? ''),
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
							redeemerIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const redeemerIndex = resolvedEntity.redeemerIndex}
					{#if redeemerIndex !== undefined && redeemerIndex !== null}
						<div>
							<dt>redeemer index</dt>
							<dd>
								<NumberValue
									value={redeemerIndex}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
