<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { networkByCaip2 } from '$/constants/Network.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.ZcashShieldedAction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.ZcashShieldedAction>>
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
		fields: {
			nullifier: true,
			noteCommitment: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.actionKind ?? prefetched.actionKind) ?? ''), String((selection.entitySelector.indexInTransaction ?? prefetched.indexInTransaction) ?? '')].filter(Boolean).join(' ') || 'Zcash shielded action')
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
		href ?? (pendingEntity.$transaction !== undefined && pendingEntity.$transaction.$network !== undefined && pendingEntity.$transaction.$network.caip2 !== undefined && pendingEntity.$transaction.$network.caip2.namespace !== undefined && pendingEntity.$transaction !== undefined && pendingEntity.$transaction.$network !== undefined && pendingEntity.$transaction.$network.caip2 !== undefined && pendingEntity.$transaction.$network.caip2.reference !== undefined && pendingEntity.$transaction !== undefined && pendingEntity.$transaction.txId !== undefined && pendingEntity.pool !== undefined && pendingEntity.actionKind !== undefined && pendingEntity.indexInTransaction !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/shielded-action/[pool]/[actionKind]/[actionIndex=nonNegativeInteger]', {
			networkSlug: String(networkByCaip2[String(String(pendingEntity.$transaction.$network.caip2.namespace) + ':' + String(pendingEntity.$transaction.$network.caip2.reference))].slug ?? ''),
			txId: String(pendingEntity.$transaction.txId ?? ''),
			pool: String(pendingEntity.pool ?? ''),
			actionKind: String(pendingEntity.actionKind ?? ''),
			actionIndex: String(pendingEntity.indexInTransaction ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={zcashShieldedAction}>
			{#snippet Pending()}
				{[String((selection.entitySelector.actionKind ?? prefetched.actionKind) ?? ''), String((selection.entitySelector.indexInTransaction ?? prefetched.indexInTransaction) ?? '')].filter(Boolean).join(' ') || title || 'Zcash shielded action'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.actionKind) ?? ''), String((resolvedEntity.indexInTransaction) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={zcashShieldedAction}>
			{#snippet Pending()}
				{[String((selection.entitySelector.pool ?? prefetched.pool) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.actionKind ?? prefetched.actionKind) ?? ''), String((selection.entitySelector.indexInTransaction ?? prefetched.indexInTransaction) ?? '')].filter(Boolean).join(' ') || title || 'Zcash shielded action'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.pool) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.actionKind) ?? ''), String((resolvedEntity.indexInTransaction) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={zcashShieldedAction}>
			{#snippet Pending()}
				{@const nullifier0 = prefetched.nullifier}
				{#if nullifier0 !== undefined && nullifier0 !== null}
					<span data-text="muted">
						{String((nullifier0) ?? '')}
					</span>
				{/if}
				{@const noteCommitment1 = prefetched.noteCommitment}
				{#if noteCommitment1 !== undefined && noteCommitment1 !== null}
					<span data-text="muted">
						{String((noteCommitment1) ?? '')}
					</span>
				{/if}
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Pool</dt>
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
							{@const pool = selection.entitySelector.pool ?? prefetched.pool}
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
				<dt>Action kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									actionKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const actionKind = selection.entitySelector.actionKind ?? prefetched.actionKind}
							{#if actionKind !== undefined && actionKind !== null}
								{String((actionKind) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									indexInTransaction: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const indexInTransaction = selection.entitySelector.indexInTransaction ?? prefetched.indexInTransaction}
							{#if indexInTransaction !== undefined && indexInTransaction !== null}
								<NumberValue value={Number(indexInTransaction)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const indexInTransaction = resolvedEntity.indexInTransaction}
							{#if indexInTransaction !== undefined && indexInTransaction !== null}
								<NumberValue value={Number(indexInTransaction)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.ZcashShieldedPool, false>('$pool')}
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
										(zcashShieldedPool[EntityMetaKey.Selector].$network !== undefined && zcashShieldedPool[EntityMetaKey.Selector].$network.caip2 !== undefined && zcashShieldedPool[EntityMetaKey.Selector].$network.caip2.namespace !== undefined && zcashShieldedPool[EntityMetaKey.Selector].$network !== undefined && zcashShieldedPool[EntityMetaKey.Selector].$network.caip2 !== undefined && zcashShieldedPool[EntityMetaKey.Selector].$network.caip2.reference !== undefined && zcashShieldedPool[EntityMetaKey.Selector].pool !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/shielded-pool/[pool]', {
											networkSlug: String(networkByCaip2[String(String(zcashShieldedPool[EntityMetaKey.Selector].$network.caip2.namespace) + ':' + String(zcashShieldedPool[EntityMetaKey.Selector].$network.caip2.reference))].slug ?? ''),
											pool: String(zcashShieldedPool[EntityMetaKey.Selector].pool ?? ''),
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
						fields: {
							nullifier: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nullifier = prefetched.nullifier}
					{#if nullifier !== undefined && nullifier !== null}
						<div>
							<dt>Nullifier</dt>
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
						fields: {
							noteCommitment: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const noteCommitment = prefetched.noteCommitment}
					{#if noteCommitment !== undefined && noteCommitment !== null}
						<div>
							<dt>Note commitment</dt>
							<dd>
								{String((noteCommitment) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							valueCommitment: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const valueCommitment = prefetched.valueCommitment}
					{#if valueCommitment !== undefined && valueCommitment !== null}
						<div>
							<dt>Value commitment</dt>
							<dd>
								{String((valueCommitment) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
							(selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.caip2 !== undefined && selection.entitySelector.$transaction.$network.caip2.namespace !== undefined && selection.entitySelector.$transaction.$network !== undefined && selection.entitySelector.$transaction.$network.caip2 !== undefined && selection.entitySelector.$transaction.$network.caip2.reference !== undefined && selection.entitySelector.$transaction.txId !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/transactions/[txId]', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$transaction.$network.caip2.namespace) + ':' + String(selection.entitySelector.$transaction.$network.caip2.reference))].slug ?? ''),
								txId: String(selection.entitySelector.$transaction.txId ?? ''),
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
