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
	}: EntitySelectionViewProps<EntityType.BlockheadLitecoinMwebWalletState_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadLitecoinMwebWalletStateTimestamp = $derived(viewSelection({
		fields: {
			balanceLitoshis: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.timestampMs ?? '') || 'blockhead litecoin mweb wallet state timestamp')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadLitecoinMwebWalletStateView from '$/views/BlockheadLitecoinMwebWalletStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLitecoinMwebWalletState_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadLitecoinMwebWalletStateTimestamp}>
			{#snippet children(entity)}
				{@const balanceLitoshis0 = entity.balanceLitoshis}
				{#if balanceLitoshis0 != null}
					<NumberValue
						value={balanceLitoshis0}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{pendingEntity.source}
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>wallet state</dt>
				<dd>
					<BlockheadLitecoinMwebWalletStateView
						selection={select(EntityType.BlockheadLitecoinMwebWalletState, selection.entitySelector.$walletState)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							mwebAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const mwebAddress = entity.mwebAddress}
					{#if mwebAddress != null}
						<div>
							<dt>MWEB address</dt>
							<dd>
								<TruncatedValue value={mwebAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							transparentAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transparentAddress = entity.transparentAddress}
					{#if transparentAddress != null}
						<div>
							<dt>transparent address</dt>
							<dd>
								<TruncatedValue value={transparentAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={blockheadLitecoinMwebWalletStateTimestamp}
			>
				{#snippet children(entity)}
					{@const balanceLitoshis = entity.balanceLitoshis}
					{#if balanceLitoshis != null}
						<div>
							<dt>balance litoshis</dt>
							<dd>
								<NumberValue
									value={balanceLitoshis}
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
							mwebBalanceLitoshis: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const mwebBalanceLitoshis = entity.mwebBalanceLitoshis}
					{#if mwebBalanceLitoshis != null}
						<div>
							<dt>MWEB balance litoshis</dt>
							<dd>
								<NumberValue
									value={mwebBalanceLitoshis}
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
							transparentBalanceLitoshis: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transparentBalanceLitoshis = entity.transparentBalanceLitoshis}
					{#if transparentBalanceLitoshis != null}
						<div>
							<dt>transparent balance litoshis</dt>
							<dd>
								<NumberValue
									value={transparentBalanceLitoshis}
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
							unconfirmedBalanceLitoshis: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const unconfirmedBalanceLitoshis = entity.unconfirmedBalanceLitoshis}
					{#if unconfirmedBalanceLitoshis != null}
						<div>
							<dt>unconfirmed balance litoshis</dt>
							<dd>
								<NumberValue
									value={unconfirmedBalanceLitoshis}
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
							immatureBalanceLitoshis: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const immatureBalanceLitoshis = entity.immatureBalanceLitoshis}
					{#if immatureBalanceLitoshis != null}
						<div>
							<dt>immature balance litoshis</dt>
							<dd>
								<NumberValue
									value={immatureBalanceLitoshis}
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
								<Timestamp timestamp={Number(lastSyncedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
