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
	import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPool.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadZcashNoteState>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BlockheadZcashNoteState>>
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
	const blockheadZcashNoteState = $derived(selection({
		sources: selection.sources,
		fields: {
			valueZatoshis: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.noteCommitment) ?? '')].filter(Boolean).join(' ') || 'blockhead zcash note state')
	const viewDomId = $derived('blockhead-zcash-note-state-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadZcashNoteState_TimestampsView from '$/views/BlockheadZcashNoteState_TimestampsView.svelte'
	import BlockheadWalletView from '$/views/BlockheadWalletView.svelte'
	import ZcashShieldedActionView from '$/views/ZcashShieldedActionView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadZcashNoteState}
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
			{[String((pendingEntity.noteCommitment) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadZcashNoteState}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.noteCommitment) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.pool) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.noteCommitment) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadZcashNoteState}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.pool) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.noteCommitment) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const valueZatoshis0 = pendingEntity.valueZatoshis}
			{#if valueZatoshis0 !== undefined && valueZatoshis0 !== null}
				<span data-text="muted">
					<NumberValue
						value={valueZatoshis0}
					/>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadZcashNoteState}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const valueZatoshis0 = resolvedEntity.valueZatoshis}
					{#if valueZatoshis0 !== undefined && valueZatoshis0 !== null}
						<span data-text="muted">
							<NumberValue
								value={valueZatoshis0}
							/>
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>wallet ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									walletId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const walletId = resolvedEntity.walletId}
							{#if walletId !== undefined && walletId !== null}
								{String((walletId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$wallet}
			>
				{#snippet children(blockheadWallet)}
					{#if blockheadWallet != null && blockheadWallet[EntityMetaKey.Selector] != null}
						<div>
							<dt>wallet</dt>
							<dd>
								<BlockheadWalletView
									selection={select(EntityType.BlockheadWallet, blockheadWallet[EntityMetaKey.Selector])}
									prefetched={blockheadWallet}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$shieldedAction}
			>
				{#snippet children(zcashShieldedAction)}
					{#if zcashShieldedAction != null && zcashShieldedAction[EntityMetaKey.Selector] != null}
						<div>
							<dt>shielded action</dt>
							<dd>
								<ZcashShieldedActionView
									selection={select(EntityType.ZcashShieldedAction, zcashShieldedAction[EntityMetaKey.Selector])}
									prefetched={zcashShieldedAction}
									href={
										(zcashShieldedAction[EntityMetaKey.Selector].pool !== undefined && zcashShieldedAction[EntityMetaKey.Selector].actionKind !== undefined && zcashShieldedAction[EntityMetaKey.Selector].indexInTransaction !== undefined && zcashShieldedAction[EntityMetaKey.Selector].$transaction !== undefined && zcashShieldedAction[EntityMetaKey.Selector].$transaction.txId !== undefined && zcashShieldedAction[EntityMetaKey.Selector].$transaction.$network !== undefined && zcashShieldedAction[EntityMetaKey.Selector].$transaction.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/shielded-action/[pool=stringSegment]/[actionKind=stringSegment]/[actionIndex=nonNegativeInteger]', {
											pool: String(zcashShieldedAction[EntityMetaKey.Selector].pool ?? ''),
											actionKind: String(zcashShieldedAction[EntityMetaKey.Selector].actionKind ?? ''),
											actionIndex: String(zcashShieldedAction[EntityMetaKey.Selector].indexInTransaction ?? ''),
											transactionId: String(zcashShieldedAction[EntityMetaKey.Selector].$transaction.txId ?? ''),
											network: String(caip2StringFromValue(zcashShieldedAction[EntityMetaKey.Selector].$transaction.$network.caip2) ?? ''),
										}) : zcashShieldedAction[EntityMetaKey.Selector].pool !== undefined && zcashShieldedAction[EntityMetaKey.Selector].actionKind !== undefined && zcashShieldedAction[EntityMetaKey.Selector].indexInTransaction !== undefined && zcashShieldedAction[EntityMetaKey.Selector].$transaction !== undefined && zcashShieldedAction[EntityMetaKey.Selector].$transaction.txId !== undefined && zcashShieldedAction[EntityMetaKey.Selector].$transaction.$network !== undefined && zcashShieldedAction[EntityMetaKey.Selector].$transaction.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/shielded-action/[pool=stringSegment]/[actionKind=stringSegment]/[actionIndex=nonNegativeInteger]', {
											pool: String(zcashShieldedAction[EntityMetaKey.Selector].pool ?? ''),
											actionKind: String(zcashShieldedAction[EntityMetaKey.Selector].actionKind ?? ''),
											actionIndex: String(zcashShieldedAction[EntityMetaKey.Selector].indexInTransaction ?? ''),
											transactionId: String(zcashShieldedAction[EntityMetaKey.Selector].$transaction.txId ?? ''),
											network: String(zcashShieldedAction[EntityMetaKey.Selector].$transaction.$network.slug ?? ''),
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
				<dt>pool</dt>
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
				<dt>note commitment</dt>
				<dd>
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
								{String((noteCommitment) ?? '')}
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
							<dt>nullifier</dt>
							<dd>
								{String((nullifier) ?? '')}
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
							valueZatoshis: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const valueZatoshis = resolvedEntity.valueZatoshis}
					{#if valueZatoshis !== undefined && valueZatoshis !== null}
						<div>
							<dt>value zatoshis</dt>
							<dd>
								<NumberValue
									value={valueZatoshis}
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
							memo: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const memo = resolvedEntity.memo}
					{#if memo !== undefined && memo !== null}
						<div>
							<dt>memo</dt>
							<dd>
								{String((memo) ?? '')}
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
							diversifier: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const diversifier = resolvedEntity.diversifier}
					{#if diversifier !== undefined && diversifier !== null}
						<div>
							<dt>diversifier</dt>
							<dd>
								{String((diversifier) ?? '')}
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
							recipientAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const recipientAddress = resolvedEntity.recipientAddress}
					{#if recipientAddress !== undefined && recipientAddress !== null}
						<div>
							<dt>recipient address</dt>
							<dd>
								<TruncatedValue value={String((recipientAddress) ?? '')} />
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
							receivedTransactionId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const receivedTransactionId = resolvedEntity.receivedTransactionId}
					{#if receivedTransactionId !== undefined && receivedTransactionId !== null}
						<div>
							<dt>received transaction ID</dt>
							<dd>
								{String((receivedTransactionId) ?? '')}
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
							receivedAtHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const receivedAtHeight = resolvedEntity.receivedAtHeight}
					{#if receivedAtHeight !== undefined && receivedAtHeight !== null}
						<div>
							<dt>received AT height</dt>
							<dd>
								<NumberValue
									value={receivedAtHeight}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadZcashNoteState_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='timestamps'
				emptyText='No Zcash note observations.'
				id='BlockheadZcashNoteState_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
