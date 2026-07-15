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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadZcashWalletState_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BlockheadZcashWalletState_Timestamp>>
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
	const blockheadZcashWalletStateTimestamp = $derived(selection({
		sources: [
			Source.Local_Internal,
			Source.ZcashClientBackend_Local,
			Source.ZcashLightwalletd_Grpc,
			Source.ZcashdWallet_JsonRpc,
		],
		fields: {
			balanceZatoshis: true,
			recoveryState: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead zcash wallet state timestamp')
	const viewDomId = $derived('blockhead-zcash-wallet-state-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadZcashWalletStateView from '$/views/BlockheadZcashWalletStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadZcashWalletState_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadZcashWalletStateTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = pendingEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadZcashWalletStateTimestamp}>
			{#snippet Pending()}
				{@const balanceZatoshis0 = pendingEntity.balanceZatoshis}
				{#if balanceZatoshis0 !== undefined && balanceZatoshis0 !== null}
					<NumberValue value={Number(balanceZatoshis0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const balanceZatoshis0 = resolvedEntity.balanceZatoshis}
				{#if balanceZatoshis0 !== undefined && balanceZatoshis0 !== null}
					<NumberValue value={Number(balanceZatoshis0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadZcashWalletStateTimestamp}>
			{#snippet Pending()}
				{@const recoveryState0 = pendingEntity.recoveryState}
				{#if recoveryState0 !== undefined && recoveryState0 !== null}
					<span data-text="muted">
						{String((recoveryState0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const recoveryState0 = resolvedEntity.recoveryState}
				{#if recoveryState0 !== undefined && recoveryState0 !== null}
					<span data-text="muted">
						{String((recoveryState0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>wallet state</dt>
				<dd>
					<BlockheadZcashWalletStateView
						selection={select(EntityType.BlockheadZcashWalletState, selection.entitySelector.$walletState, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
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
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = pendingEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							recoveryState: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const recoveryState = pendingEntity.recoveryState}
					{#if recoveryState !== undefined && recoveryState !== null}
						<div>
							<dt>recovery state</dt>
							<dd>
								{String((recoveryState) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const recoveryState = resolvedEntity.recoveryState}
					{#if recoveryState !== undefined && recoveryState !== null}
						<div>
							<dt>recovery state</dt>
							<dd>
								{String((recoveryState) ?? '')}
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
							balanceZatoshis: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const balanceZatoshis = pendingEntity.balanceZatoshis}
					{#if balanceZatoshis !== undefined && balanceZatoshis !== null}
						<div>
							<dt>balance zatoshis</dt>
							<dd>
								<NumberValue value={Number(balanceZatoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const balanceZatoshis = resolvedEntity.balanceZatoshis}
					{#if balanceZatoshis !== undefined && balanceZatoshis !== null}
						<div>
							<dt>balance zatoshis</dt>
							<dd>
								<NumberValue value={Number(balanceZatoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							verifiedBalanceZatoshis: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const verifiedBalanceZatoshis = pendingEntity.verifiedBalanceZatoshis}
					{#if verifiedBalanceZatoshis !== undefined && verifiedBalanceZatoshis !== null}
						<div>
							<dt>verified balance zatoshis</dt>
							<dd>
								<NumberValue value={Number(verifiedBalanceZatoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const verifiedBalanceZatoshis = resolvedEntity.verifiedBalanceZatoshis}
					{#if verifiedBalanceZatoshis !== undefined && verifiedBalanceZatoshis !== null}
						<div>
							<dt>verified balance zatoshis</dt>
							<dd>
								<NumberValue value={Number(verifiedBalanceZatoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							spendableBalanceZatoshis: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const spendableBalanceZatoshis = pendingEntity.spendableBalanceZatoshis}
					{#if spendableBalanceZatoshis !== undefined && spendableBalanceZatoshis !== null}
						<div>
							<dt>spendable balance zatoshis</dt>
							<dd>
								<NumberValue value={Number(spendableBalanceZatoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const spendableBalanceZatoshis = resolvedEntity.spendableBalanceZatoshis}
					{#if spendableBalanceZatoshis !== undefined && spendableBalanceZatoshis !== null}
						<div>
							<dt>spendable balance zatoshis</dt>
							<dd>
								<NumberValue value={Number(spendableBalanceZatoshis)} />
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
							unshieldedBalanceZatoshis: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const unshieldedBalanceZatoshis = pendingEntity.unshieldedBalanceZatoshis}
					{#if unshieldedBalanceZatoshis !== undefined && unshieldedBalanceZatoshis !== null}
						<div>
							<dt>unshielded balance zatoshis</dt>
							<dd>
								<NumberValue value={Number(unshieldedBalanceZatoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const unshieldedBalanceZatoshis = resolvedEntity.unshieldedBalanceZatoshis}
					{#if unshieldedBalanceZatoshis !== undefined && unshieldedBalanceZatoshis !== null}
						<div>
							<dt>unshielded balance zatoshis</dt>
							<dd>
								<NumberValue value={Number(unshieldedBalanceZatoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							saplingBalanceZatoshis: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const saplingBalanceZatoshis = pendingEntity.saplingBalanceZatoshis}
					{#if saplingBalanceZatoshis !== undefined && saplingBalanceZatoshis !== null}
						<div>
							<dt>sapling balance zatoshis</dt>
							<dd>
								<NumberValue value={Number(saplingBalanceZatoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const saplingBalanceZatoshis = resolvedEntity.saplingBalanceZatoshis}
					{#if saplingBalanceZatoshis !== undefined && saplingBalanceZatoshis !== null}
						<div>
							<dt>sapling balance zatoshis</dt>
							<dd>
								<NumberValue value={Number(saplingBalanceZatoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							orchardBalanceZatoshis: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const orchardBalanceZatoshis = pendingEntity.orchardBalanceZatoshis}
					{#if orchardBalanceZatoshis !== undefined && orchardBalanceZatoshis !== null}
						<div>
							<dt>orchard balance zatoshis</dt>
							<dd>
								<NumberValue value={Number(orchardBalanceZatoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const orchardBalanceZatoshis = resolvedEntity.orchardBalanceZatoshis}
					{#if orchardBalanceZatoshis !== undefined && orchardBalanceZatoshis !== null}
						<div>
							<dt>orchard balance zatoshis</dt>
							<dd>
								<NumberValue value={Number(orchardBalanceZatoshis)} />
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
							changePendingConfirmationZatoshis: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const changePendingConfirmationZatoshis = pendingEntity.changePendingConfirmationZatoshis}
					{#if changePendingConfirmationZatoshis !== undefined && changePendingConfirmationZatoshis !== null}
						<div>
							<dt>change pending confirmation zatoshis</dt>
							<dd>
								<NumberValue value={Number(changePendingConfirmationZatoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const changePendingConfirmationZatoshis = resolvedEntity.changePendingConfirmationZatoshis}
					{#if changePendingConfirmationZatoshis !== undefined && changePendingConfirmationZatoshis !== null}
						<div>
							<dt>change pending confirmation zatoshis</dt>
							<dd>
								<NumberValue value={Number(changePendingConfirmationZatoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							valuePendingSpendabilityZatoshis: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const valuePendingSpendabilityZatoshis = pendingEntity.valuePendingSpendabilityZatoshis}
					{#if valuePendingSpendabilityZatoshis !== undefined && valuePendingSpendabilityZatoshis !== null}
						<div>
							<dt>value pending spendability zatoshis</dt>
							<dd>
								<NumberValue value={Number(valuePendingSpendabilityZatoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const valuePendingSpendabilityZatoshis = resolvedEntity.valuePendingSpendabilityZatoshis}
					{#if valuePendingSpendabilityZatoshis !== undefined && valuePendingSpendabilityZatoshis !== null}
						<div>
							<dt>value pending spendability zatoshis</dt>
							<dd>
								<NumberValue value={Number(valuePendingSpendabilityZatoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							uneconomicValueZatoshis: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const uneconomicValueZatoshis = pendingEntity.uneconomicValueZatoshis}
					{#if uneconomicValueZatoshis !== undefined && uneconomicValueZatoshis !== null}
						<div>
							<dt>uneconomic value zatoshis</dt>
							<dd>
								<NumberValue value={Number(uneconomicValueZatoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const uneconomicValueZatoshis = resolvedEntity.uneconomicValueZatoshis}
					{#if uneconomicValueZatoshis !== undefined && uneconomicValueZatoshis !== null}
						<div>
							<dt>uneconomic value zatoshis</dt>
							<dd>
								<NumberValue value={Number(uneconomicValueZatoshis)} />
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
							lastScannedHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lastScannedHeight = pendingEntity.lastScannedHeight}
					{#if lastScannedHeight !== undefined && lastScannedHeight !== null}
						<div>
							<dt>last scanned height</dt>
							<dd>
								<NumberValue value={Number(lastScannedHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastScannedHeight = resolvedEntity.lastScannedHeight}
					{#if lastScannedHeight !== undefined && lastScannedHeight !== null}
						<div>
							<dt>last scanned height</dt>
							<dd>
								<NumberValue value={Number(lastScannedHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							chainTipHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const chainTipHeight = pendingEntity.chainTipHeight}
					{#if chainTipHeight !== undefined && chainTipHeight !== null}
						<div>
							<dt>chain tip height</dt>
							<dd>
								<NumberValue value={Number(chainTipHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const chainTipHeight = resolvedEntity.chainTipHeight}
					{#if chainTipHeight !== undefined && chainTipHeight !== null}
						<div>
							<dt>chain tip height</dt>
							<dd>
								<NumberValue value={Number(chainTipHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastSyncedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lastSyncedAt = pendingEntity.lastSyncedAt}
					{#if lastSyncedAt !== undefined && lastSyncedAt !== null}
						<div>
							<dt>last synced AT</dt>
							<dd>
								<Timestamp timestamp={Number(lastSyncedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastSyncedAt = resolvedEntity.lastSyncedAt}
					{#if lastSyncedAt !== undefined && lastSyncedAt !== null}
						<div>
							<dt>last synced AT</dt>
							<dd>
								<Timestamp timestamp={Number(lastSyncedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
