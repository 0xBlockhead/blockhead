<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.ZcashShieldedAction> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const zcashShieldedAction = $derived(selection({
		fields: {
			nullifier: true,
			noteCommitment: true,
		},
	}))
	const titleFallback = $derived([(pendingEntity.actionKind ?? ''), String(pendingEntity.indexInTransaction ?? '')].filter(Boolean).join(' ') || 'Zcash shielded action')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ZcashShieldedPoolView from '$/views/ZcashShieldedPoolView.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.ZcashShieldedAction}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/shielded-action/[pool=stringSegment]/[actionKind=stringSegment]/[actionIndex=nonNegativeInteger]',
			{
				network: (
					'caip2' in selection.entitySelector.$transaction.$network ?
						String(caip2StringFromValue(selection.entitySelector.$transaction.$network.caip2))
					:
						String(selection.entitySelector.$transaction.$network.slug)
				),
				transactionId: String(selection.entitySelector.$transaction.txId),
				pool: String(selection.entitySelector.pool),
				actionKind: String(selection.entitySelector.actionKind),
				actionIndex: String(selection.entitySelector.indexInTransaction),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{[(pendingEntity.actionKind ?? ''), String(pendingEntity.indexInTransaction ?? '')].filter(Boolean).join(' ') || 'Zcash shielded action'}
	{/snippet}

	{#snippet Value()}
		{(pendingEntity.pool ?? '') || [(pendingEntity.actionKind ?? ''), String(pendingEntity.indexInTransaction ?? '')].filter(Boolean).join(' ') || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={zcashShieldedAction}>
			{#snippet children(entity)}
				{@const nullifier0 = entity.nullifier}
				{#if nullifier0 != null}
					<span data-text="muted">
						{nullifier0}
					</span>
				{/if}
				{@const noteCommitment1 = entity.noteCommitment}
				{#if noteCommitment1 != null}
					<span data-text="muted">
						{noteCommitment1}
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
					{pendingEntity.pool}
				</dd>
			</div>

			<div>
				<dt>Action kind</dt>
				<dd>
					{pendingEntity.actionKind}
				</dd>
			</div>

			<div>
				<dt>Index in transaction</dt>
				<dd>
					<NumberValue
						value={pendingEntity.indexInTransaction}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$pool}
			>
				{#snippet children(zcashShieldedPool)}
					{#if zcashShieldedPool != null}
						<div>
							<dt>Pool</dt>
							<dd>
								<ZcashShieldedPoolView
									selection={select(EntityType.ZcashShieldedPool, zcashShieldedPool[EntityMetaKey.Selector])}
									prefetched={zcashShieldedPool}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={zcashShieldedAction}
			>
				{#snippet children(entity)}
					{@const nullifier = entity.nullifier}
					{#if nullifier != null}
						<div>
							<dt>Nullifier</dt>
							<dd>
								{nullifier}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={zcashShieldedAction}
			>
				{#snippet children(entity)}
					{@const noteCommitment = entity.noteCommitment}
					{#if noteCommitment != null}
						<div>
							<dt>Note commitment</dt>
							<dd>
								{noteCommitment}
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
				{#snippet children(entity)}
					{@const valueCommitment = entity.valueCommitment}
					{#if valueCommitment != null}
						<div>
							<dt>Value commitment</dt>
							<dd>
								{valueCommitment}
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
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
