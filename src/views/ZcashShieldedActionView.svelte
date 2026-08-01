<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.ZcashShieldedAction>, 'prefetched'> = $props()

	const transaction = $derived(selection.entitySelector.$transaction)
	const zcashShieldedAction = $derived(selection({
		fields: {
			nullifier: true,
			noteCommitment: true,
		},
	}))
	const titleFallback = $derived([selection.entitySelector.actionKind, String(selection.entitySelector.indexInTransaction)].filter(Boolean).join(' ') || 'Zcash shielded action')


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
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/[transactionId=evmTxHashOrSolanaSignatureOrUtxoTxId]/(selection)/shielded-action/[pool=stringSegment]/[actionKind=stringSegment]/[actionIndex=nonNegativeInteger]',
				{
					network: (
						'caip2' in transaction.$network ?
							caip2StringFromValue(transaction.$network.caip2)
						:
							transaction.$network.slug
					),
					transactionId: transaction.txId,
					pool: selection.entitySelector.pool,
					actionKind: selection.entitySelector.actionKind,
					actionIndex: String(selection.entitySelector.indexInTransaction),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		{selection.entitySelector.pool || [selection.entitySelector.actionKind, String(selection.entitySelector.indexInTransaction)].filter(Boolean).join(' ') || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={zcashShieldedAction}>
			{#snippet children(entity)}
				{@const nullifier = entity.nullifier}
				{#if nullifier != null}
					<span data-text="muted">
						{nullifier}
					</span>
				{/if}
				{@const noteCommitment = entity.noteCommitment}
				{#if noteCommitment != null}
					<span data-text="muted">
						{noteCommitment}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Pool</dt>
				<dd>
					{selection.entitySelector.pool}
				</dd>
			</div>

			<div>
				<dt>Action kind</dt>
				<dd>
					{selection.entitySelector.actionKind}
				</dd>
			</div>

			<div>
				<dt>Index in transaction</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.indexInTransaction}
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
									layout={EntityLayout.Value}
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
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
