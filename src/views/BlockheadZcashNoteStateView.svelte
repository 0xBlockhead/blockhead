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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadZcashNoteState>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadZcashNoteState>>
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
		sources: [
			Source.Local_Internal,
			Source.ZcashClientBackend_Local,
			Source.ZcashLightwalletd_Grpc,
			Source.ZcashdWallet_JsonRpc,
		],
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
		<ResourceBoundary resource={blockheadZcashNoteState}>
			{#snippet Pending()}
				{[String((pendingEntity.noteCommitment) ?? '')].filter(Boolean).join(' ') || title || 'blockhead zcash note state'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.noteCommitment) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadZcashNoteState}>
			{#snippet Pending()}
				{[String((pendingEntity.pool) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.noteCommitment) ?? '')].filter(Boolean).join(' ') || title || 'blockhead zcash note state'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.pool) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.noteCommitment) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadZcashNoteState}>
			{#snippet Pending()}
				{@const valueZatoshis0 = pendingEntity.valueZatoshis}
				{#if valueZatoshis0 !== undefined && valueZatoshis0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(valueZatoshis0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const valueZatoshis0 = resolvedEntity.valueZatoshis}
				{#if valueZatoshis0 !== undefined && valueZatoshis0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(valueZatoshis0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>wallet ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									walletId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const walletId = pendingEntity.walletId}
							{#if walletId !== undefined && walletId !== null}
								{String((walletId) ?? '')}
							{/if}
						{/snippet}

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
				{#snippet Pending()}{/snippet}

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
				{#snippet Pending()}{/snippet}

				{#snippet children(zcashShieldedAction)}
					{#if zcashShieldedAction != null && zcashShieldedAction[EntityMetaKey.Selector] != null}
						<div>
							<dt>shielded action</dt>
							<dd>
								<ZcashShieldedActionView
									selection={select(EntityType.ZcashShieldedAction, zcashShieldedAction[EntityMetaKey.Selector])}
									prefetched={zcashShieldedAction}
									href={
										(zcashShieldedAction[EntityMetaKey.Selector].$transaction !== undefined && zcashShieldedAction[EntityMetaKey.Selector].$transaction.$network !== undefined && zcashShieldedAction[EntityMetaKey.Selector].$transaction.$network.slug !== undefined && zcashShieldedAction[EntityMetaKey.Selector].$transaction.txId !== undefined && zcashShieldedAction[EntityMetaKey.Selector].pool !== undefined && zcashShieldedAction[EntityMetaKey.Selector].actionKind !== undefined && zcashShieldedAction[EntityMetaKey.Selector].indexInTransaction !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/shielded-action/[pool=stringSegment]/[actionKind=stringSegment]/[actionIndex=nonNegativeInteger]', {
											network: String(zcashShieldedAction[EntityMetaKey.Selector].$transaction.$network.slug ?? ''),
											transactionId: String(zcashShieldedAction[EntityMetaKey.Selector].$transaction.txId ?? ''),
											pool: String(zcashShieldedAction[EntityMetaKey.Selector].pool ?? ''),
											actionKind: String(zcashShieldedAction[EntityMetaKey.Selector].actionKind ?? ''),
											actionIndex: String(zcashShieldedAction[EntityMetaKey.Selector].indexInTransaction ?? ''),
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
								fields: {
									pool: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const pool = pendingEntity.pool}
							{#if pool !== undefined && pool !== null}
								{String((pool) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									noteCommitment: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const noteCommitment = pendingEntity.noteCommitment}
							{#if noteCommitment !== undefined && noteCommitment !== null}
								{String((noteCommitment) ?? '')}
							{/if}
						{/snippet}

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
						fields: {
							nullifier: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nullifier = pendingEntity.nullifier}
					{#if nullifier !== undefined && nullifier !== null}
						<div>
							<dt>nullifier</dt>
							<dd>
								{String((nullifier) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							valueZatoshis: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const valueZatoshis = pendingEntity.valueZatoshis}
					{#if valueZatoshis !== undefined && valueZatoshis !== null}
						<div>
							<dt>value zatoshis</dt>
							<dd>
								<NumberValue value={Number(valueZatoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const valueZatoshis = resolvedEntity.valueZatoshis}
					{#if valueZatoshis !== undefined && valueZatoshis !== null}
						<div>
							<dt>value zatoshis</dt>
							<dd>
								<NumberValue value={Number(valueZatoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							memo: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const memo = pendingEntity.memo}
					{#if memo !== undefined && memo !== null}
						<div>
							<dt>memo</dt>
							<dd>
								{String((memo) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							diversifier: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const diversifier = pendingEntity.diversifier}
					{#if diversifier !== undefined && diversifier !== null}
						<div>
							<dt>diversifier</dt>
							<dd>
								{String((diversifier) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							recipientAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const recipientAddress = pendingEntity.recipientAddress}
					{#if recipientAddress !== undefined && recipientAddress !== null}
						<div>
							<dt>recipient address</dt>
							<dd>
								<TruncatedValue value={String((recipientAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							receivedTransactionId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const receivedTransactionId = pendingEntity.receivedTransactionId}
					{#if receivedTransactionId !== undefined && receivedTransactionId !== null}
						<div>
							<dt>received transaction ID</dt>
							<dd>
								{String((receivedTransactionId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							receivedAtHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const receivedAtHeight = pendingEntity.receivedAtHeight}
					{#if receivedAtHeight !== undefined && receivedAtHeight !== null}
						<div>
							<dt>received AT height</dt>
							<dd>
								<NumberValue value={Number(receivedAtHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const receivedAtHeight = resolvedEntity.receivedAtHeight}
					{#if receivedAtHeight !== undefined && receivedAtHeight !== null}
						<div>
							<dt>received AT height</dt>
							<dd>
								<NumberValue value={Number(receivedAtHeight)} />
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
