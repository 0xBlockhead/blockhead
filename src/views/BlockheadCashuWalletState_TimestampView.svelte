<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.BlockheadCashuWalletState_Timestamp> = $props()

	const blockheadCashuWalletStateTimestamp = $derived(selection({
		fields: {
			balance: true,
			$walletState: {
				fields: {
					unit: true,
				},
			},
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadCashuWalletStateView from '$/views/BlockheadCashuWalletStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadCashuWalletState_Timestamp}
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
		<ResourceBoundary resource={blockheadCashuWalletStateTimestamp}>
			{#snippet children(entity)}
				{@const balance = entity.balance}
				{#if balance != null}
					<NumberValue
						value={balance}
					/>

					<span>{selection.entitySelector.$walletState.unit == null ? '' : ` ${selection.entitySelector.$walletState.unit}`}</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>wallet state</dt>
				<dd>
					<BlockheadCashuWalletStateView
						selection={select(EntityType.BlockheadCashuWalletState, selection.entitySelector.$walletState)}
						layout={EntityLayout.Value}
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
				resource={blockheadCashuWalletStateTimestamp}
			>
				{#snippet children(entity)}
					{@const balance = entity.balance}
					{#if balance != null}
						<div>
							<dt>balance</dt>
							<dd>
								<NumberValue
									value={balance}
								/>

								<span>{selection.entitySelector.$walletState.unit == null ? '' : ` ${selection.entitySelector.$walletState.unit}`}</span>
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
							proofCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const proofCount = entity.proofCount}
					{#if proofCount != null}
						<div>
							<dt>proof count</dt>
							<dd>
								<NumberValue
									value={proofCount}
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
							unspentProofCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const unspentProofCount = entity.unspentProofCount}
					{#if unspentProofCount != null}
						<div>
							<dt>unspent proof count</dt>
							<dd>
								<NumberValue
									value={unspentProofCount}
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
							pendingProofCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pendingProofCount = entity.pendingProofCount}
					{#if pendingProofCount != null}
						<div>
							<dt>pending proof count</dt>
							<dd>
								<NumberValue
									value={pendingProofCount}
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
							spentProofCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const spentProofCount = entity.spentProofCount}
					{#if spentProofCount != null}
						<div>
							<dt>spent proof count</dt>
							<dd>
								<NumberValue
									value={spentProofCount}
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
					selection({
						fields: {
							activeKeysetCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const activeKeysetCount = entity.activeKeysetCount}
					{#if activeKeysetCount != null}
						<div>
							<dt>active keyset count</dt>
							<dd>
								<NumberValue
									value={activeKeysetCount}
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
							pendingMintQuoteCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pendingMintQuoteCount = entity.pendingMintQuoteCount}
					{#if pendingMintQuoteCount != null}
						<div>
							<dt>pending mint quote count</dt>
							<dd>
								<NumberValue
									value={pendingMintQuoteCount}
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
							pendingMeltQuoteCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pendingMeltQuoteCount = entity.pendingMeltQuoteCount}
					{#if pendingMeltQuoteCount != null}
						<div>
							<dt>pending melt quote count</dt>
							<dd>
								<NumberValue
									value={pendingMeltQuoteCount}
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
							tokenCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tokenCount = entity.tokenCount}
					{#if tokenCount != null}
						<div>
							<dt>token count</dt>
							<dd>
								<NumberValue
									value={tokenCount}
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
