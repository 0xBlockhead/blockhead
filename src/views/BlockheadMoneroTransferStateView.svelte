<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadMoneroTransferState>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BlockheadMoneroTransferState>>
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
	const blockheadMoneroTransferState = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			direction: true,
			amountAtomicUnits: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.txHash) ?? '')].filter(Boolean).join(' ') || 'blockhead monero transfer state')
	const viewDomId = $derived('blockhead-monero-transfer-state-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadMoneroTransferState_TimestampsView from '$/views/BlockheadMoneroTransferState_TimestampsView.svelte'
	import BlockheadWalletView from '$/views/BlockheadWalletView.svelte'
	import MoneroNetworkView from '$/views/MoneroNetworkView.svelte'
	import MoneroTransactionView from '$/views/MoneroTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadMoneroTransferState}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadMoneroTransferState}>
			{#snippet Pending()}
				{[String((pendingEntity.txHash) ?? '')].filter(Boolean).join(' ') || title || 'blockhead monero transfer state'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.txHash) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadMoneroTransferState}>
			{#snippet Pending()}
				{[String((pendingEntity.direction) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.txHash) ?? '')].filter(Boolean).join(' ') || title || 'blockhead monero transfer state'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.direction) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.txHash) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadMoneroTransferState}>
			{#snippet Pending()}
				{@const amountAtomicUnits0 = pendingEntity.amountAtomicUnits}
				{#if amountAtomicUnits0 !== undefined && amountAtomicUnits0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(amountAtomicUnits0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const amountAtomicUnits0 = resolvedEntity.amountAtomicUnits}
				{#if amountAtomicUnits0 !== undefined && amountAtomicUnits0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(amountAtomicUnits0)} />
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

			<div>
				<dt>network</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$network}
					>
						{#snippet children(moneroNetwork)}
							{#if moneroNetwork != null && moneroNetwork[EntityMetaKey.Selector] != null}
								<MoneroNetworkView
									selection={select(EntityType.MoneroNetwork, moneroNetwork[EntityMetaKey.Selector])}
									prefetched={moneroNetwork}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$transaction}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(moneroTransaction)}
					{#if moneroTransaction != null && moneroTransaction[EntityMetaKey.Selector] != null}
						<div>
							<dt>transaction</dt>
							<dd>
								<MoneroTransactionView
									selection={select(EntityType.MoneroTransaction, moneroTransaction[EntityMetaKey.Selector])}
									prefetched={moneroTransaction}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Transaction hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									txHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const txHash = pendingEntity.txHash}
							{#if txHash !== undefined && txHash !== null}
								<TruncatedValue value={String((txHash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const txHash = resolvedEntity.txHash}
							{#if txHash !== undefined && txHash !== null}
								<TruncatedValue value={String((txHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>transfer index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									transferIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const transferIndex = pendingEntity.transferIndex}
							{#if transferIndex !== undefined && transferIndex !== null}
								<NumberValue value={Number(transferIndex)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const transferIndex = resolvedEntity.transferIndex}
							{#if transferIndex !== undefined && transferIndex !== null}
								<NumberValue value={Number(transferIndex)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>direction</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									direction: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const direction = pendingEntity.direction}
							{#if direction !== undefined && direction !== null}
								{String((direction) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const direction = resolvedEntity.direction}
							{#if direction !== undefined && direction !== null}
								{String((direction) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							amountAtomicUnits: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const amountAtomicUnits = pendingEntity.amountAtomicUnits}
					{#if amountAtomicUnits !== undefined && amountAtomicUnits !== null}
						<div>
							<dt>amount atomic units</dt>
							<dd>
								<NumberValue value={Number(amountAtomicUnits)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amountAtomicUnits = resolvedEntity.amountAtomicUnits}
					{#if amountAtomicUnits !== undefined && amountAtomicUnits !== null}
						<div>
							<dt>amount atomic units</dt>
							<dd>
								<NumberValue value={Number(amountAtomicUnits)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feeAtomicUnits: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const feeAtomicUnits = pendingEntity.feeAtomicUnits}
					{#if feeAtomicUnits !== undefined && feeAtomicUnits !== null}
						<div>
							<dt>fee atomic units</dt>
							<dd>
								<NumberValue value={Number(feeAtomicUnits)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeAtomicUnits = resolvedEntity.feeAtomicUnits}
					{#if feeAtomicUnits !== undefined && feeAtomicUnits !== null}
						<div>
							<dt>fee atomic units</dt>
							<dd>
								<NumberValue value={Number(feeAtomicUnits)} />
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
							accountIndex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const accountIndex = pendingEntity.accountIndex}
					{#if accountIndex !== undefined && accountIndex !== null}
						<div>
							<dt>account index</dt>
							<dd>
								<NumberValue value={Number(accountIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const accountIndex = resolvedEntity.accountIndex}
					{#if accountIndex !== undefined && accountIndex !== null}
						<div>
							<dt>account index</dt>
							<dd>
								<NumberValue value={Number(accountIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							addressIndex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const addressIndex = pendingEntity.addressIndex}
					{#if addressIndex !== undefined && addressIndex !== null}
						<div>
							<dt>address index</dt>
							<dd>
								<NumberValue value={Number(addressIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const addressIndex = resolvedEntity.addressIndex}
					{#if addressIndex !== undefined && addressIndex !== null}
						<div>
							<dt>address index</dt>
							<dd>
								<NumberValue value={Number(addressIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							paymentId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const paymentId = pendingEntity.paymentId}
					{#if paymentId !== undefined && paymentId !== null}
						<div>
							<dt>payment ID</dt>
							<dd>
								{String((paymentId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const paymentId = resolvedEntity.paymentId}
					{#if paymentId !== undefined && paymentId !== null}
						<div>
							<dt>payment ID</dt>
							<dd>
								{String((paymentId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							note: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const note = pendingEntity.note}
					{#if note !== undefined && note !== null}
						<div>
							<dt>note</dt>
							<dd>
								{String((note) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const note = resolvedEntity.note}
					{#if note !== undefined && note !== null}
						<div>
							<dt>note</dt>
							<dd>
								{String((note) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							keyImage: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const keyImage = pendingEntity.keyImage}
					{#if keyImage !== undefined && keyImage !== null}
						<div>
							<dt>key image</dt>
							<dd>
								{String((keyImage) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const keyImage = resolvedEntity.keyImage}
					{#if keyImage !== undefined && keyImage !== null}
						<div>
							<dt>key image</dt>
							<dd>
								{String((keyImage) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs = resolvedEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadMoneroTransferState_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='timestamps'
				emptyText='No Monero transfer observations.'
				id='BlockheadMoneroTransferState_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
