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
	import { ZcashShieldedActionKind } from '$/schema/ZcashShieldedAction.ts'
	import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPool.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.ZcashShieldedAction>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.ZcashShieldedAction>>
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
	const zcashShieldedAction = $derived(selection({
		sources: selection.sources,
		fields: {
			nullifier: true,
			noteCommitment: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.actionKind) ?? ''), String((pendingEntity.indexInTransaction) ?? '')].filter(Boolean).join(' ') || 'Zcash shielded action')
	const viewDomId = $derived('zcash-shielded-action-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ZcashShieldedPoolView from '$/views/ZcashShieldedPoolView.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.ZcashShieldedAction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.pool !== undefined && pendingEntity.actionKind !== undefined && pendingEntity.indexInTransaction !== undefined && pendingEntity.$transaction !== undefined && pendingEntity.$transaction.txId !== undefined && pendingEntity.$transaction.$network !== undefined && pendingEntity.$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/shielded-action/[pool=stringSegment]/[actionKind=stringSegment]/[actionIndex=nonNegativeInteger]', {
			pool: String(pendingEntity.pool ?? ''),
			actionKind: String(pendingEntity.actionKind ?? ''),
			actionIndex: String(pendingEntity.indexInTransaction ?? ''),
			transactionId: String(pendingEntity.$transaction.txId ?? ''),
			network: String(caip2StringFromValue(pendingEntity.$transaction.$network.caip2) ?? ''),
		}) : pendingEntity.pool !== undefined && pendingEntity.actionKind !== undefined && pendingEntity.indexInTransaction !== undefined && pendingEntity.$transaction !== undefined && pendingEntity.$transaction.txId !== undefined && pendingEntity.$transaction.$network !== undefined && pendingEntity.$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/shielded-action/[pool=stringSegment]/[actionKind=stringSegment]/[actionIndex=nonNegativeInteger]', {
			pool: String(pendingEntity.pool ?? ''),
			actionKind: String(pendingEntity.actionKind ?? ''),
			actionIndex: String(pendingEntity.indexInTransaction ?? ''),
			transactionId: String(pendingEntity.$transaction.txId ?? ''),
			network: String(pendingEntity.$transaction.$network.slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.actionKind) ?? ''), String((pendingEntity.indexInTransaction) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={zcashShieldedAction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.actionKind) ?? ''), String((resolvedEntity.indexInTransaction) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.pool) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.actionKind) ?? ''), String((pendingEntity.indexInTransaction) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={zcashShieldedAction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.pool) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.actionKind) ?? ''), String((resolvedEntity.indexInTransaction) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const nullifier0 = pendingEntity.nullifier}
			{#if nullifier0 !== undefined && nullifier0 !== null}
				<span data-text="muted">
					{String((nullifier0) ?? '')}
				</span>
			{/if}
			{@const noteCommitment1 = pendingEntity.noteCommitment}
			{#if noteCommitment1 !== undefined && noteCommitment1 !== null}
				<span data-text="muted">
					{String((noteCommitment1) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={zcashShieldedAction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nullifier0 = resolvedEntity.nullifier}
					{#if nullifier0 !== undefined && nullifier0 !== null}
						<span data-text="muted">
							{String((nullifier0) ?? '')}
						</span>
					{/if}
					{@const noteCommitment1 = resolvedEntity.noteCommitment}
					{#if noteCommitment1 !== undefined && noteCommitment1 !== null}
						<span data-text="muted">
							{String((noteCommitment1) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Pool</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									pool: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const pool = resolvedEntity.pool}
							{#if pool !== undefined && pool !== null}
								{String((pool) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Action kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									actionKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const actionKind = resolvedEntity.actionKind}
							{#if actionKind !== undefined && actionKind !== null}
								{String((actionKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Index in transaction</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									indexInTransaction: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const indexInTransaction = resolvedEntity.indexInTransaction}
							{#if indexInTransaction !== undefined && indexInTransaction !== null}
								<NumberValue
									value={indexInTransaction}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$pool}
			>
				{#snippet children(zcashShieldedPool)}
					{#if zcashShieldedPool != null && zcashShieldedPool[EntityMetaKey.Selector] != null}
						<div>
							<dt>Pool</dt>
							<dd>
								<ZcashShieldedPoolView
									selection={select(EntityType.ZcashShieldedPool, zcashShieldedPool[EntityMetaKey.Selector])}
									prefetched={zcashShieldedPool}
									href={
										(zcashShieldedPool[EntityMetaKey.Selector].pool !== undefined && zcashShieldedPool[EntityMetaKey.Selector].$network !== undefined && zcashShieldedPool[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/shielded-pool/[pool=stringSegment]', {
											pool: String(zcashShieldedPool[EntityMetaKey.Selector].pool ?? ''),
											network: String(caip2StringFromValue(zcashShieldedPool[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : zcashShieldedPool[EntityMetaKey.Selector].pool !== undefined && zcashShieldedPool[EntityMetaKey.Selector].$network !== undefined && zcashShieldedPool[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/shielded-pool/[pool=stringSegment]', {
											pool: String(zcashShieldedPool[EntityMetaKey.Selector].pool ?? ''),
											network: String(zcashShieldedPool[EntityMetaKey.Selector].$network.slug ?? ''),
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
							nullifier: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nullifier = resolvedEntity.nullifier}
					{#if nullifier !== undefined && nullifier !== null}
						<div>
							<dt>Nullifier</dt>
							<dd>
								{String((nullifier) ?? '')}
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
							noteCommitment: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const noteCommitment = resolvedEntity.noteCommitment}
					{#if noteCommitment !== undefined && noteCommitment !== null}
						<div>
							<dt>Note commitment</dt>
							<dd>
								{String((noteCommitment) ?? '')}
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
							valueCommitment: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const valueCommitment = resolvedEntity.valueCommitment}
					{#if valueCommitment !== undefined && valueCommitment !== null}
						<div>
							<dt>Value commitment</dt>
							<dd>
								{String((valueCommitment) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Transaction</dt>
				<dd>
					<UtxoTransactionView
						selection={
							select(EntityType.UtxoTransaction, selection.entitySelector.$transaction, {
								sources: [
									Source.Zcashd_JsonRpc,
								],
							})
						}
						href={
							(selection.entitySelector.$transaction.txId !== undefined && selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
								transactionId: String(selection.entitySelector.$transaction.txId ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$transaction.$network.caip2) ?? ''),
							}) : selection.entitySelector.$transaction.txId !== undefined && selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
								transactionId: String(selection.entitySelector.$transaction.txId ?? ''),
								network: String(selection.entitySelector.$transaction.$network.slug ?? ''),
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
