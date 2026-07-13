<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadLitecoinMwebWalletState_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadLitecoinMwebWalletState_Timestamp>>
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
		sources: [
			Source.Local_Internal,
		],
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
		<ResourceBoundary resource={blockheadLitecoinMwebWalletStateTimestamp}>
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
		<ResourceBoundary resource={blockheadLitecoinMwebWalletStateTimestamp}>
			{#snippet Pending()}
				{@const balanceLitoshis0 = pendingEntity.balanceLitoshis}
				{#if balanceLitoshis0 !== undefined && balanceLitoshis0 !== null}
					<NumberValue value={Number(balanceLitoshis0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const balanceLitoshis0 = resolvedEntity.balanceLitoshis}
				{#if balanceLitoshis0 !== undefined && balanceLitoshis0 !== null}
					<NumberValue value={Number(balanceLitoshis0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadLitecoinMwebWalletStateTimestamp}>
			{#snippet Pending()}
				{@const source0 = pendingEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}

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
							mwebAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const mwebAddress = pendingEntity.mwebAddress}
					{#if mwebAddress !== undefined && mwebAddress !== null}
						<div>
							<dt>MWEB address</dt>
							<dd>
								<TruncatedValue value={String((mwebAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							transparentAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transparentAddress = pendingEntity.transparentAddress}
					{#if transparentAddress !== undefined && transparentAddress !== null}
						<div>
							<dt>transparent address</dt>
							<dd>
								<TruncatedValue value={String((transparentAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							balanceLitoshis: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const balanceLitoshis = pendingEntity.balanceLitoshis}
					{#if balanceLitoshis !== undefined && balanceLitoshis !== null}
						<div>
							<dt>balance litoshis</dt>
							<dd>
								<NumberValue value={Number(balanceLitoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const balanceLitoshis = resolvedEntity.balanceLitoshis}
					{#if balanceLitoshis !== undefined && balanceLitoshis !== null}
						<div>
							<dt>balance litoshis</dt>
							<dd>
								<NumberValue value={Number(balanceLitoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							mwebBalanceLitoshis: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const mwebBalanceLitoshis = pendingEntity.mwebBalanceLitoshis}
					{#if mwebBalanceLitoshis !== undefined && mwebBalanceLitoshis !== null}
						<div>
							<dt>MWEB balance litoshis</dt>
							<dd>
								<NumberValue value={Number(mwebBalanceLitoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mwebBalanceLitoshis = resolvedEntity.mwebBalanceLitoshis}
					{#if mwebBalanceLitoshis !== undefined && mwebBalanceLitoshis !== null}
						<div>
							<dt>MWEB balance litoshis</dt>
							<dd>
								<NumberValue value={Number(mwebBalanceLitoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transparentBalanceLitoshis: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transparentBalanceLitoshis = pendingEntity.transparentBalanceLitoshis}
					{#if transparentBalanceLitoshis !== undefined && transparentBalanceLitoshis !== null}
						<div>
							<dt>transparent balance litoshis</dt>
							<dd>
								<NumberValue value={Number(transparentBalanceLitoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transparentBalanceLitoshis = resolvedEntity.transparentBalanceLitoshis}
					{#if transparentBalanceLitoshis !== undefined && transparentBalanceLitoshis !== null}
						<div>
							<dt>transparent balance litoshis</dt>
							<dd>
								<NumberValue value={Number(transparentBalanceLitoshis)} />
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
							unconfirmedBalanceLitoshis: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const unconfirmedBalanceLitoshis = pendingEntity.unconfirmedBalanceLitoshis}
					{#if unconfirmedBalanceLitoshis !== undefined && unconfirmedBalanceLitoshis !== null}
						<div>
							<dt>unconfirmed balance litoshis</dt>
							<dd>
								<NumberValue value={Number(unconfirmedBalanceLitoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const unconfirmedBalanceLitoshis = resolvedEntity.unconfirmedBalanceLitoshis}
					{#if unconfirmedBalanceLitoshis !== undefined && unconfirmedBalanceLitoshis !== null}
						<div>
							<dt>unconfirmed balance litoshis</dt>
							<dd>
								<NumberValue value={Number(unconfirmedBalanceLitoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							immatureBalanceLitoshis: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const immatureBalanceLitoshis = pendingEntity.immatureBalanceLitoshis}
					{#if immatureBalanceLitoshis !== undefined && immatureBalanceLitoshis !== null}
						<div>
							<dt>immature balance litoshis</dt>
							<dd>
								<NumberValue value={Number(immatureBalanceLitoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const immatureBalanceLitoshis = resolvedEntity.immatureBalanceLitoshis}
					{#if immatureBalanceLitoshis !== undefined && immatureBalanceLitoshis !== null}
						<div>
							<dt>immature balance litoshis</dt>
							<dd>
								<NumberValue value={Number(immatureBalanceLitoshis)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
