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
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.BlockheadZcashNoteState>
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
	const blockheadZcashNoteState = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			valueZatoshis: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			valueZatoshis: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.noteCommitment) ?? '')].filter(Boolean).join(' ') || 'blockhead zcash note state')
	const viewDomId = $derived('blockhead-zcash-note-state-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'valueZatoshis')}
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
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'valueZatoshis')}
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
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'valueZatoshis')}
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
										(
											zcashShieldedAction[EntityMetaKey.Selector] != null && 'pool' in zcashShieldedAction[EntityMetaKey.Selector]
											&& zcashShieldedAction[EntityMetaKey.Selector].pool != null
											&& zcashShieldedAction[EntityMetaKey.Selector] != null && 'actionKind' in zcashShieldedAction[EntityMetaKey.Selector]
											&& zcashShieldedAction[EntityMetaKey.Selector].actionKind != null
											&& zcashShieldedAction[EntityMetaKey.Selector] != null && 'indexInTransaction' in zcashShieldedAction[EntityMetaKey.Selector]
											&& zcashShieldedAction[EntityMetaKey.Selector].indexInTransaction != null
											&& zcashShieldedAction[EntityMetaKey.Selector] != null && '$transaction' in zcashShieldedAction[EntityMetaKey.Selector]
											&& zcashShieldedAction[EntityMetaKey.Selector].$transaction != null && 'txId' in zcashShieldedAction[EntityMetaKey.Selector].$transaction
											&& zcashShieldedAction[EntityMetaKey.Selector].$transaction.txId != null
											&& zcashShieldedAction[EntityMetaKey.Selector].$transaction != null && '$network' in zcashShieldedAction[EntityMetaKey.Selector].$transaction ?
												zcashShieldedAction[EntityMetaKey.Selector].$transaction.$network != null && 'caip2' in zcashShieldedAction[EntityMetaKey.Selector].$transaction.$network
												&& zcashShieldedAction[EntityMetaKey.Selector].$transaction.$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/shielded-action/[pool=stringSegment]/[actionKind=stringSegment]/[actionIndex=nonNegativeInteger]', {
												pool: String(zcashShieldedAction[EntityMetaKey.Selector].pool ?? ''),
												actionKind: String(zcashShieldedAction[EntityMetaKey.Selector].actionKind ?? ''),
												actionIndex: String(zcashShieldedAction[EntityMetaKey.Selector].indexInTransaction ?? ''),
												transactionId: String(zcashShieldedAction[EntityMetaKey.Selector].$transaction.txId ?? ''),
												network: String(caip2StringFromValue(zcashShieldedAction[EntityMetaKey.Selector].$transaction.$network.caip2) ?? ''),
											})
											:
													zcashShieldedAction[EntityMetaKey.Selector].$transaction.$network != null && 'slug' in zcashShieldedAction[EntityMetaKey.Selector].$transaction.$network
													&& zcashShieldedAction[EntityMetaKey.Selector].$transaction.$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/shielded-action/[pool=stringSegment]/[actionKind=stringSegment]/[actionIndex=nonNegativeInteger]', {
													pool: String(zcashShieldedAction[EntityMetaKey.Selector].pool ?? ''),
													actionKind: String(zcashShieldedAction[EntityMetaKey.Selector].actionKind ?? ''),
													actionIndex: String(zcashShieldedAction[EntityMetaKey.Selector].indexInTransaction ?? ''),
													transactionId: String(zcashShieldedAction[EntityMetaKey.Selector].$transaction.txId ?? ''),
													network: String(zcashShieldedAction[EntityMetaKey.Selector].$transaction.$network.slug ?? ''),
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
		{@const blockheadZcashNoteStateBlockheadZcashNoteStateTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={blockheadZcashNoteStateBlockheadZcashNoteStateTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<BlockheadZcashNoteState_TimestampsView
					selection={blockheadZcashNoteStateBlockheadZcashNoteStateTimestampsViewTimestampsResource}
					countResource={blockheadZcashNoteStateBlockheadZcashNoteStateTimestampsViewTimestampsResource.count}
					title='timestamps'
					id='BlockheadZcashNoteState_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
