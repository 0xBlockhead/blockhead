<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BlockheadZcashWalletState_Timestamp> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
			Source.ZcashClientBackend_Local,
			Source.ZcashLightwalletd_Grpc,
			Source.ZcashdWallet_JsonRpc,
		],
	}))
	const blockheadZcashWalletStateTimestamp = $derived(viewSelection({
		fields: {
			balanceZatoshis: true,
			recoveryState: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadZcashWalletStateView from '$/views/BlockheadZcashWalletStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadZcashWalletState_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadZcashWalletStateTimestamp}>
			{#snippet children(entity)}
				{@const balanceZatoshis = entity.balanceZatoshis}
				{#if balanceZatoshis != null}
					<NumberValue
						value={balanceZatoshis}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadZcashWalletStateTimestamp}>
			{#snippet children(entity)}
				{@const recoveryState = entity.recoveryState}
				{#if recoveryState != null}
					<span data-text="muted">
						{recoveryState}
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
						selection={select(EntityType.BlockheadZcashWalletState, selection.entitySelector.$walletState)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadZcashWalletStateTimestamp}
			>
				{#snippet children(entity)}
					{@const recoveryState = entity.recoveryState}
					{#if recoveryState != null}
						<div>
							<dt>recovery state</dt>
							<dd>
								{recoveryState}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={blockheadZcashWalletStateTimestamp}
			>
				{#snippet children(entity)}
					{@const balanceZatoshis = entity.balanceZatoshis}
					{#if balanceZatoshis != null}
						<div>
							<dt>balance zatoshis</dt>
							<dd>
								<NumberValue
									value={balanceZatoshis}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							verifiedBalanceZatoshis: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const verifiedBalanceZatoshis = entity.verifiedBalanceZatoshis}
					{#if verifiedBalanceZatoshis != null}
						<div>
							<dt>verified balance zatoshis</dt>
							<dd>
								<NumberValue
									value={verifiedBalanceZatoshis}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							spendableBalanceZatoshis: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const spendableBalanceZatoshis = entity.spendableBalanceZatoshis}
					{#if spendableBalanceZatoshis != null}
						<div>
							<dt>spendable balance zatoshis</dt>
							<dd>
								<NumberValue
									value={spendableBalanceZatoshis}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							unshieldedBalanceZatoshis: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const unshieldedBalanceZatoshis = entity.unshieldedBalanceZatoshis}
					{#if unshieldedBalanceZatoshis != null}
						<div>
							<dt>unshielded balance zatoshis</dt>
							<dd>
								<NumberValue
									value={unshieldedBalanceZatoshis}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							saplingBalanceZatoshis: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const saplingBalanceZatoshis = entity.saplingBalanceZatoshis}
					{#if saplingBalanceZatoshis != null}
						<div>
							<dt>sapling balance zatoshis</dt>
							<dd>
								<NumberValue
									value={saplingBalanceZatoshis}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							orchardBalanceZatoshis: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const orchardBalanceZatoshis = entity.orchardBalanceZatoshis}
					{#if orchardBalanceZatoshis != null}
						<div>
							<dt>orchard balance zatoshis</dt>
							<dd>
								<NumberValue
									value={orchardBalanceZatoshis}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							changePendingConfirmationZatoshis: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const changePendingConfirmationZatoshis = entity.changePendingConfirmationZatoshis}
					{#if changePendingConfirmationZatoshis != null}
						<div>
							<dt>change pending confirmation zatoshis</dt>
							<dd>
								<NumberValue
									value={changePendingConfirmationZatoshis}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							valuePendingSpendabilityZatoshis: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const valuePendingSpendabilityZatoshis = entity.valuePendingSpendabilityZatoshis}
					{#if valuePendingSpendabilityZatoshis != null}
						<div>
							<dt>value pending spendability zatoshis</dt>
							<dd>
								<NumberValue
									value={valuePendingSpendabilityZatoshis}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							uneconomicValueZatoshis: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const uneconomicValueZatoshis = entity.uneconomicValueZatoshis}
					{#if uneconomicValueZatoshis != null}
						<div>
							<dt>uneconomic value zatoshis</dt>
							<dd>
								<NumberValue
									value={uneconomicValueZatoshis}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							lastScannedHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastScannedHeight = entity.lastScannedHeight}
					{#if lastScannedHeight != null}
						<div>
							<dt>last scanned height</dt>
							<dd>
								<NumberValue
									value={lastScannedHeight}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							chainTipHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const chainTipHeight = entity.chainTipHeight}
					{#if chainTipHeight != null}
						<div>
							<dt>chain tip height</dt>
							<dd>
								<NumberValue
									value={chainTipHeight}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							lastSyncedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastSyncedAt = entity.lastSyncedAt}
					{#if lastSyncedAt != null}
						<div>
							<dt>last synced AT</dt>
							<dd>
								<Timestamp timestamp={lastSyncedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
