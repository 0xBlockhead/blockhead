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
	import { ZcashShieldedActionKind } from '$/schema/ZcashShieldedAction.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.ZcashShieldedAction>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.ZcashShieldedAction>
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
	const zcashShieldedAction = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			nullifier: true,
			noteCommitment: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			nullifier: true,
			noteCommitment: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.actionKind) ?? ''), String((pendingEntity.indexInTransaction) ?? '')].filter(Boolean).join(' ') || 'Zcash shielded action')
	const viewDomId = $derived('zcash-shielded-action-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		href ?? (
			selection.entitySelector != null && 'pool' in selection.entitySelector
			&& selection.entitySelector.pool != null
			&& selection.entitySelector != null && 'actionKind' in selection.entitySelector
			&& selection.entitySelector.actionKind != null
			&& selection.entitySelector != null && 'indexInTransaction' in selection.entitySelector
			&& selection.entitySelector.indexInTransaction != null
			&& selection.entitySelector != null && '$transaction' in selection.entitySelector
			&& selection.entitySelector.$transaction != null && 'txId' in selection.entitySelector.$transaction
			&& selection.entitySelector.$transaction.txId != null
			&& selection.entitySelector.$transaction != null && '$network' in selection.entitySelector.$transaction ?
				selection.entitySelector.$transaction.$network != null && 'caip2' in selection.entitySelector.$transaction.$network
				&& selection.entitySelector.$transaction.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/shielded-action/[pool=stringSegment]/[actionKind=stringSegment]/[actionIndex=nonNegativeInteger]', {
				pool: String(selection.entitySelector.pool ?? ''),
				actionKind: String(selection.entitySelector.actionKind ?? ''),
				actionIndex: String(selection.entitySelector.indexInTransaction ?? ''),
				transactionId: String(selection.entitySelector.$transaction.txId ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$transaction.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$transaction.$network != null && 'slug' in selection.entitySelector.$transaction.$network
					&& selection.entitySelector.$transaction.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/shielded-action/[pool=stringSegment]/[actionKind=stringSegment]/[actionIndex=nonNegativeInteger]', {
					pool: String(selection.entitySelector.pool ?? ''),
					actionKind: String(selection.entitySelector.actionKind ?? ''),
					actionIndex: String(selection.entitySelector.indexInTransaction ?? ''),
					transactionId: String(selection.entitySelector.$transaction.txId ?? ''),
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
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'nullifier') && Object.hasOwn(prefetched, 'noteCommitment')}
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
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'nullifier') && Object.hasOwn(prefetched, 'noteCommitment')}
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
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'nullifier') && Object.hasOwn(prefetched, 'noteCommitment')}
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
										(
											zcashShieldedPool[EntityMetaKey.Selector] != null && 'pool' in zcashShieldedPool[EntityMetaKey.Selector]
											&& zcashShieldedPool[EntityMetaKey.Selector].pool != null
											&& zcashShieldedPool[EntityMetaKey.Selector] != null && '$network' in zcashShieldedPool[EntityMetaKey.Selector] ?
												zcashShieldedPool[EntityMetaKey.Selector].$network != null && 'caip2' in zcashShieldedPool[EntityMetaKey.Selector].$network
												&& zcashShieldedPool[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/shielded-pool/[pool=stringSegment]', {
												pool: String(zcashShieldedPool[EntityMetaKey.Selector].pool ?? ''),
												network: String(caip2StringFromValue(zcashShieldedPool[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													zcashShieldedPool[EntityMetaKey.Selector].$network != null && 'slug' in zcashShieldedPool[EntityMetaKey.Selector].$network
													&& zcashShieldedPool[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/shielded-pool/[pool=stringSegment]', {
													pool: String(zcashShieldedPool[EntityMetaKey.Selector].pool ?? ''),
													network: String(zcashShieldedPool[EntityMetaKey.Selector].$network.slug ?? ''),
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
						selection={select(EntityType.UtxoTransaction, selection.entitySelector.$transaction)}
						href={
							(
								selection.entitySelector.$transaction != null && 'txId' in selection.entitySelector.$transaction
								&& selection.entitySelector.$transaction.txId != null
								&& selection.entitySelector.$transaction != null && '$network' in selection.entitySelector.$transaction ?
									selection.entitySelector.$transaction.$network != null && 'caip2' in selection.entitySelector.$transaction.$network
									&& selection.entitySelector.$transaction.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
									transactionId: String(selection.entitySelector.$transaction.txId ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$transaction.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$transaction.$network != null && 'slug' in selection.entitySelector.$transaction.$network
										&& selection.entitySelector.$transaction.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]', {
										transactionId: String(selection.entitySelector.$transaction.txId ?? ''),
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
		</dl>
	{/snippet}
</EntityView>
