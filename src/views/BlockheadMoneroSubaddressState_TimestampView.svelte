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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadMoneroSubaddressState_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadMoneroSubaddressState_Timestamp>>
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
	const blockheadMoneroSubaddressStateTimestamp = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			balanceAtomicUnits: true,
			used: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead monero subaddress state timestamp')
	const viewDomId = $derived('blockhead-monero-subaddress-state-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadMoneroSubaddressStateView from '$/views/BlockheadMoneroSubaddressStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadMoneroSubaddressState_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadMoneroSubaddressStateTimestamp}>
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
		<ResourceBoundary resource={blockheadMoneroSubaddressStateTimestamp}>
			{#snippet Pending()}
				{@const balanceAtomicUnits0 = pendingEntity.balanceAtomicUnits}
				{#if balanceAtomicUnits0 !== undefined && balanceAtomicUnits0 !== null}
					<NumberValue value={Number(balanceAtomicUnits0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const balanceAtomicUnits0 = resolvedEntity.balanceAtomicUnits}
				{#if balanceAtomicUnits0 !== undefined && balanceAtomicUnits0 !== null}
					<NumberValue value={Number(balanceAtomicUnits0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadMoneroSubaddressStateTimestamp}>
			{#snippet Pending()}
				{@const used0 = pendingEntity.used}
				{#if used0 !== undefined && used0 !== null}
					<span data-text="muted">
						{used0 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const used0 = resolvedEntity.used}
				{#if used0 !== undefined && used0 !== null}
					<span data-text="muted">
						{used0 ? 'Yes' : 'No'}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>subaddress state</dt>
				<dd>
					<BlockheadMoneroSubaddressStateView
						selection={select(EntityType.BlockheadMoneroSubaddressState, selection.entitySelector.$subaddressState, {})}
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
							used: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const used = pendingEntity.used}
					{#if used !== undefined && used !== null}
						<div>
							<dt>used</dt>
							<dd>
								{used ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const used = resolvedEntity.used}
					{#if used !== undefined && used !== null}
						<div>
							<dt>used</dt>
							<dd>
								{used ? 'Yes' : 'No'}
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
							balanceAtomicUnits: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const balanceAtomicUnits = pendingEntity.balanceAtomicUnits}
					{#if balanceAtomicUnits !== undefined && balanceAtomicUnits !== null}
						<div>
							<dt>balance atomic units</dt>
							<dd>
								<NumberValue value={Number(balanceAtomicUnits)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const balanceAtomicUnits = resolvedEntity.balanceAtomicUnits}
					{#if balanceAtomicUnits !== undefined && balanceAtomicUnits !== null}
						<div>
							<dt>balance atomic units</dt>
							<dd>
								<NumberValue value={Number(balanceAtomicUnits)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							unlockedBalanceAtomicUnits: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const unlockedBalanceAtomicUnits = pendingEntity.unlockedBalanceAtomicUnits}
					{#if unlockedBalanceAtomicUnits !== undefined && unlockedBalanceAtomicUnits !== null}
						<div>
							<dt>unlocked balance atomic units</dt>
							<dd>
								<NumberValue value={Number(unlockedBalanceAtomicUnits)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const unlockedBalanceAtomicUnits = resolvedEntity.unlockedBalanceAtomicUnits}
					{#if unlockedBalanceAtomicUnits !== undefined && unlockedBalanceAtomicUnits !== null}
						<div>
							<dt>unlocked balance atomic units</dt>
							<dd>
								<NumberValue value={Number(unlockedBalanceAtomicUnits)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							numUnspentOutputs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const numUnspentOutputs = pendingEntity.numUnspentOutputs}
					{#if numUnspentOutputs !== undefined && numUnspentOutputs !== null}
						<div>
							<dt>num unspent outputs</dt>
							<dd>
								<NumberValue value={Number(numUnspentOutputs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const numUnspentOutputs = resolvedEntity.numUnspentOutputs}
					{#if numUnspentOutputs !== undefined && numUnspentOutputs !== null}
						<div>
							<dt>num unspent outputs</dt>
							<dd>
								<NumberValue value={Number(numUnspentOutputs)} />
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
							blocksToUnlock: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blocksToUnlock = pendingEntity.blocksToUnlock}
					{#if blocksToUnlock !== undefined && blocksToUnlock !== null}
						<div>
							<dt>blocks to unlock</dt>
							<dd>
								<NumberValue value={Number(blocksToUnlock)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blocksToUnlock = resolvedEntity.blocksToUnlock}
					{#if blocksToUnlock !== undefined && blocksToUnlock !== null}
						<div>
							<dt>blocks to unlock</dt>
							<dd>
								<NumberValue value={Number(blocksToUnlock)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							timeToUnlockSeconds: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const timeToUnlockSeconds = pendingEntity.timeToUnlockSeconds}
					{#if timeToUnlockSeconds !== undefined && timeToUnlockSeconds !== null}
						<div>
							<dt>time to unlock seconds</dt>
							<dd>
								<NumberValue value={Number(timeToUnlockSeconds)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timeToUnlockSeconds = resolvedEntity.timeToUnlockSeconds}
					{#if timeToUnlockSeconds !== undefined && timeToUnlockSeconds !== null}
						<div>
							<dt>time to unlock seconds</dt>
							<dd>
								<NumberValue value={Number(timeToUnlockSeconds)} />
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
