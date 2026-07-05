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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadCashuWalletState_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadCashuWalletState_Timestamp>>
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
	const blockheadCashuWalletStateTimestamp = $derived(selection({
		fields: {
			balance: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead Cashu wallet state timestamp')
	const viewDomId = $derived('blockhead-cashu-wallet-state-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadCashuWalletStateView from '$/views/BlockheadCashuWalletStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadCashuWalletState_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadCashuWalletStateTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
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
		<ResourceBoundary resource={blockheadCashuWalletStateTimestamp}>
			{#snippet Pending()}
				{@const balance0 = prefetched.balance}
				{#if balance0 !== undefined && balance0 !== null}
					<NumberValue value={Number(balance0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const balance0 = resolvedEntity.balance}
				{#if balance0 !== undefined && balance0 !== null}
					<NumberValue value={Number(balance0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadCashuWalletStateTimestamp}>
			{#snippet Pending()}
				{@const source0 = selection.entitySelector.source ?? prefetched.source}
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
					<BlockheadCashuWalletStateView
						selection={select(EntityType.BlockheadCashuWalletState, selection.entitySelector.$walletState)}
						layout={EntityLayout.Title}
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
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
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
							{@const source = selection.entitySelector.source ?? prefetched.source}
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
							balance: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const balance = prefetched.balance}
					{#if balance !== undefined && balance !== null}
						<div>
							<dt>balance</dt>
							<dd>
								<NumberValue value={Number(balance)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const balance = resolvedEntity.balance}
					{#if balance !== undefined && balance !== null}
						<div>
							<dt>balance</dt>
							<dd>
								<NumberValue value={Number(balance)} />
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
				{#snippet Pending()}
					{@const proofCount = prefetched.proofCount}
					{#if proofCount !== undefined && proofCount !== null}
						<div>
							<dt>proof count</dt>
							<dd>
								<NumberValue value={Number(proofCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const proofCount = resolvedEntity.proofCount}
					{#if proofCount !== undefined && proofCount !== null}
						<div>
							<dt>proof count</dt>
							<dd>
								<NumberValue value={Number(proofCount)} />
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
				{#snippet Pending()}
					{@const unspentProofCount = prefetched.unspentProofCount}
					{#if unspentProofCount !== undefined && unspentProofCount !== null}
						<div>
							<dt>unspent proof count</dt>
							<dd>
								<NumberValue value={Number(unspentProofCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const unspentProofCount = resolvedEntity.unspentProofCount}
					{#if unspentProofCount !== undefined && unspentProofCount !== null}
						<div>
							<dt>unspent proof count</dt>
							<dd>
								<NumberValue value={Number(unspentProofCount)} />
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
				{#snippet Pending()}
					{@const pendingProofCount = prefetched.pendingProofCount}
					{#if pendingProofCount !== undefined && pendingProofCount !== null}
						<div>
							<dt>pending proof count</dt>
							<dd>
								<NumberValue value={Number(pendingProofCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pendingProofCount = resolvedEntity.pendingProofCount}
					{#if pendingProofCount !== undefined && pendingProofCount !== null}
						<div>
							<dt>pending proof count</dt>
							<dd>
								<NumberValue value={Number(pendingProofCount)} />
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
				{#snippet Pending()}
					{@const spentProofCount = prefetched.spentProofCount}
					{#if spentProofCount !== undefined && spentProofCount !== null}
						<div>
							<dt>spent proof count</dt>
							<dd>
								<NumberValue value={Number(spentProofCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const spentProofCount = resolvedEntity.spentProofCount}
					{#if spentProofCount !== undefined && spentProofCount !== null}
						<div>
							<dt>spent proof count</dt>
							<dd>
								<NumberValue value={Number(spentProofCount)} />
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
				{#snippet Pending()}
					{@const activeKeysetCount = prefetched.activeKeysetCount}
					{#if activeKeysetCount !== undefined && activeKeysetCount !== null}
						<div>
							<dt>active keyset count</dt>
							<dd>
								<NumberValue value={Number(activeKeysetCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const activeKeysetCount = resolvedEntity.activeKeysetCount}
					{#if activeKeysetCount !== undefined && activeKeysetCount !== null}
						<div>
							<dt>active keyset count</dt>
							<dd>
								<NumberValue value={Number(activeKeysetCount)} />
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
				{#snippet Pending()}
					{@const pendingMintQuoteCount = prefetched.pendingMintQuoteCount}
					{#if pendingMintQuoteCount !== undefined && pendingMintQuoteCount !== null}
						<div>
							<dt>pending mint quote count</dt>
							<dd>
								<NumberValue value={Number(pendingMintQuoteCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pendingMintQuoteCount = resolvedEntity.pendingMintQuoteCount}
					{#if pendingMintQuoteCount !== undefined && pendingMintQuoteCount !== null}
						<div>
							<dt>pending mint quote count</dt>
							<dd>
								<NumberValue value={Number(pendingMintQuoteCount)} />
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
				{#snippet Pending()}
					{@const pendingMeltQuoteCount = prefetched.pendingMeltQuoteCount}
					{#if pendingMeltQuoteCount !== undefined && pendingMeltQuoteCount !== null}
						<div>
							<dt>pending melt quote count</dt>
							<dd>
								<NumberValue value={Number(pendingMeltQuoteCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const pendingMeltQuoteCount = resolvedEntity.pendingMeltQuoteCount}
					{#if pendingMeltQuoteCount !== undefined && pendingMeltQuoteCount !== null}
						<div>
							<dt>pending melt quote count</dt>
							<dd>
								<NumberValue value={Number(pendingMeltQuoteCount)} />
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
				{#snippet Pending()}
					{@const tokenCount = prefetched.tokenCount}
					{#if tokenCount !== undefined && tokenCount !== null}
						<div>
							<dt>token count</dt>
							<dd>
								<NumberValue value={Number(tokenCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tokenCount = resolvedEntity.tokenCount}
					{#if tokenCount !== undefined && tokenCount !== null}
						<div>
							<dt>token count</dt>
							<dd>
								<NumberValue value={Number(tokenCount)} />
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
					{@const lastSyncedAt = prefetched.lastSyncedAt}
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
