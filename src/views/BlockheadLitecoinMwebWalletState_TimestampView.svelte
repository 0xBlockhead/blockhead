<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadLitecoinMwebWalletState_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BlockheadLitecoinMwebWalletState_Timestamp>>
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
	const blockheadLitecoinMwebWalletStateTimestamp = $derived(selection({
		sources: selection.sources,
		fields: {
			balanceLitoshis: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead litecoin mweb wallet state timestamp')
	const viewDomId = $derived('blockhead-litecoin-mweb-wallet-state-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadLitecoinMwebWalletStateView from '$/views/BlockheadLitecoinMwebWalletStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLitecoinMwebWalletState_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const timestampMs0 = pendingEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
		{:else}
			<ResourceBoundary resource={blockheadLitecoinMwebWalletStateTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs0 = resolvedEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const balanceLitoshis0 = pendingEntity.balanceLitoshis}
					{#if balanceLitoshis0 !== undefined && balanceLitoshis0 !== null}
						<NumberValue
							value={balanceLitoshis0}
						/>
					{/if}
		{:else}
			<ResourceBoundary resource={blockheadLitecoinMwebWalletStateTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const balanceLitoshis0 = resolvedEntity.balanceLitoshis}
					{#if balanceLitoshis0 !== undefined && balanceLitoshis0 !== null}
						<NumberValue
							value={balanceLitoshis0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const source0 = pendingEntity.source}
			{#if source0 !== undefined && source0 !== null}
				<span data-text="muted">
					{String((source0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadLitecoinMwebWalletStateTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const source0 = resolvedEntity.source}
					{#if source0 !== undefined && source0 !== null}
						<span data-text="muted">
							{String((source0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>wallet state</dt>
				<dd>
					<BlockheadLitecoinMwebWalletStateView
						selection={select(EntityType.BlockheadLitecoinMwebWalletState, selection.entitySelector.$walletState, {})}
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
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
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
						sources: selection.sources,
						fields: {
							mwebAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mwebAddress = resolvedEntity.mwebAddress}
					{#if mwebAddress !== undefined && mwebAddress !== null}
						<div>
							<dt>MWEB address</dt>
							<dd>
								<TruncatedValue value={String((mwebAddress) ?? '')} />
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
							transparentAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transparentAddress = resolvedEntity.transparentAddress}
					{#if transparentAddress !== undefined && transparentAddress !== null}
						<div>
							<dt>transparent address</dt>
							<dd>
								<TruncatedValue value={String((transparentAddress) ?? '')} />
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
							balanceLitoshis: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const balanceLitoshis = resolvedEntity.balanceLitoshis}
					{#if balanceLitoshis !== undefined && balanceLitoshis !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							mwebBalanceLitoshis: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mwebBalanceLitoshis = resolvedEntity.mwebBalanceLitoshis}
					{#if mwebBalanceLitoshis !== undefined && mwebBalanceLitoshis !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							transparentBalanceLitoshis: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transparentBalanceLitoshis = resolvedEntity.transparentBalanceLitoshis}
					{#if transparentBalanceLitoshis !== undefined && transparentBalanceLitoshis !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							unconfirmedBalanceLitoshis: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const unconfirmedBalanceLitoshis = resolvedEntity.unconfirmedBalanceLitoshis}
					{#if unconfirmedBalanceLitoshis !== undefined && unconfirmedBalanceLitoshis !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							immatureBalanceLitoshis: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const immatureBalanceLitoshis = resolvedEntity.immatureBalanceLitoshis}
					{#if immatureBalanceLitoshis !== undefined && immatureBalanceLitoshis !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							lastScannedHeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastScannedHeight = resolvedEntity.lastScannedHeight}
					{#if lastScannedHeight !== undefined && lastScannedHeight !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							lastSyncedAt: true,
						},
					})
				}
			>
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
