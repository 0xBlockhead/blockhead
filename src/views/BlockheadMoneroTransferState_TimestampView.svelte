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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadMoneroTransferState_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadMoneroTransferState_Timestamp>>
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
	const blockheadMoneroTransferStateTimestamp = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			spent: true,
			confirmations: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead monero transfer state timestamp')
	const viewDomId = $derived('blockhead-monero-transfer-state-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadMoneroTransferStateView from '$/views/BlockheadMoneroTransferStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadMoneroTransferState_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadMoneroTransferStateTimestamp}>
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
		<ResourceBoundary resource={blockheadMoneroTransferStateTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.spent) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'blockhead monero transfer state timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.spent) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadMoneroTransferStateTimestamp}>
			{#snippet Pending()}
				{@const confirmations0 = pendingEntity.confirmations}
				{#if confirmations0 !== undefined && confirmations0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(confirmations0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const confirmations0 = resolvedEntity.confirmations}
				{#if confirmations0 !== undefined && confirmations0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(confirmations0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>transfer state</dt>
				<dd>
					<BlockheadMoneroTransferStateView
						selection={select(EntityType.BlockheadMoneroTransferState, selection.entitySelector.$transferState, {})}
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
							confirmations: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const confirmations = pendingEntity.confirmations}
					{#if confirmations !== undefined && confirmations !== null}
						<div>
							<dt>confirmations</dt>
							<dd>
								<NumberValue value={Number(confirmations)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const confirmations = resolvedEntity.confirmations}
					{#if confirmations !== undefined && confirmations !== null}
						<div>
							<dt>confirmations</dt>
							<dd>
								<NumberValue value={Number(confirmations)} />
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
							unlockTime: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const unlockTime = pendingEntity.unlockTime}
					{#if unlockTime !== undefined && unlockTime !== null}
						<div>
							<dt>unlock time</dt>
							<dd>
								<NumberValue value={Number(unlockTime)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const unlockTime = resolvedEntity.unlockTime}
					{#if unlockTime !== undefined && unlockTime !== null}
						<div>
							<dt>unlock time</dt>
							<dd>
								<NumberValue value={Number(unlockTime)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							spent: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const spent = pendingEntity.spent}
					{#if spent !== undefined && spent !== null}
						<div>
							<dt>spent</dt>
							<dd>
								{spent ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const spent = resolvedEntity.spent}
					{#if spent !== undefined && spent !== null}
						<div>
							<dt>spent</dt>
							<dd>
								{spent ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastCheckedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lastCheckedAt = pendingEntity.lastCheckedAt}
					{#if lastCheckedAt !== undefined && lastCheckedAt !== null}
						<div>
							<dt>last checked AT</dt>
							<dd>
								<Timestamp timestamp={Number(lastCheckedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastCheckedAt = resolvedEntity.lastCheckedAt}
					{#if lastCheckedAt !== undefined && lastCheckedAt !== null}
						<div>
							<dt>last checked AT</dt>
							<dd>
								<Timestamp timestamp={Number(lastCheckedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
