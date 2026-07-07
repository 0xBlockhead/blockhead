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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadLightningChannelState_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadLightningChannelState_Timestamp>>
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
	const blockheadLightningChannelStateTimestamp = $derived(selection({
		sources: [
			Source.LightningLnd_Grpc,
			Source.LightningLnd_Rest,
			Source.Local_Internal,
		],
		fields: {
			active: true,
			localBalanceSats: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead Lightning channel state timestamp')
	const viewDomId = $derived('blockhead-lightning-channel-state-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadLightningChannelStateView from '$/views/BlockheadLightningChannelStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLightningChannelState_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadLightningChannelStateTimestamp}>
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
		<ResourceBoundary resource={blockheadLightningChannelStateTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.active) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'blockhead Lightning channel state timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.active) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadLightningChannelStateTimestamp}>
			{#snippet Pending()}
				{@const localBalanceSats0 = prefetched.localBalanceSats}
				{#if localBalanceSats0 !== undefined && localBalanceSats0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(localBalanceSats0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const localBalanceSats0 = resolvedEntity.localBalanceSats}
				{#if localBalanceSats0 !== undefined && localBalanceSats0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(localBalanceSats0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>channel state</dt>
				<dd>
					<BlockheadLightningChannelStateView
						selection={select(EntityType.BlockheadLightningChannelState, selection.entitySelector.$channelState, {})}
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
							active: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const active = prefetched.active}
					{#if active !== undefined && active !== null}
						<div>
							<dt>active</dt>
							<dd>
								{active ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const active = resolvedEntity.active}
					{#if active !== undefined && active !== null}
						<div>
							<dt>active</dt>
							<dd>
								{active ? 'Yes' : 'No'}
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
							localBalanceSats: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const localBalanceSats = prefetched.localBalanceSats}
					{#if localBalanceSats !== undefined && localBalanceSats !== null}
						<div>
							<dt>local balance sats</dt>
							<dd>
								<NumberValue value={Number(localBalanceSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const localBalanceSats = resolvedEntity.localBalanceSats}
					{#if localBalanceSats !== undefined && localBalanceSats !== null}
						<div>
							<dt>local balance sats</dt>
							<dd>
								<NumberValue value={Number(localBalanceSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							remoteBalanceSats: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const remoteBalanceSats = prefetched.remoteBalanceSats}
					{#if remoteBalanceSats !== undefined && remoteBalanceSats !== null}
						<div>
							<dt>remote balance sats</dt>
							<dd>
								<NumberValue value={Number(remoteBalanceSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const remoteBalanceSats = resolvedEntity.remoteBalanceSats}
					{#if remoteBalanceSats !== undefined && remoteBalanceSats !== null}
						<div>
							<dt>remote balance sats</dt>
							<dd>
								<NumberValue value={Number(remoteBalanceSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							unsettledBalanceSats: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const unsettledBalanceSats = prefetched.unsettledBalanceSats}
					{#if unsettledBalanceSats !== undefined && unsettledBalanceSats !== null}
						<div>
							<dt>unsettled balance sats</dt>
							<dd>
								<NumberValue value={Number(unsettledBalanceSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const unsettledBalanceSats = resolvedEntity.unsettledBalanceSats}
					{#if unsettledBalanceSats !== undefined && unsettledBalanceSats !== null}
						<div>
							<dt>unsettled balance sats</dt>
							<dd>
								<NumberValue value={Number(unsettledBalanceSats)} />
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
							commitFeeSats: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const commitFeeSats = prefetched.commitFeeSats}
					{#if commitFeeSats !== undefined && commitFeeSats !== null}
						<div>
							<dt>commit fee sats</dt>
							<dd>
								<NumberValue value={Number(commitFeeSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const commitFeeSats = resolvedEntity.commitFeeSats}
					{#if commitFeeSats !== undefined && commitFeeSats !== null}
						<div>
							<dt>commit fee sats</dt>
							<dd>
								<NumberValue value={Number(commitFeeSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							commitWeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const commitWeight = prefetched.commitWeight}
					{#if commitWeight !== undefined && commitWeight !== null}
						<div>
							<dt>commit weight</dt>
							<dd>
								<NumberValue value={Number(commitWeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const commitWeight = resolvedEntity.commitWeight}
					{#if commitWeight !== undefined && commitWeight !== null}
						<div>
							<dt>commit weight</dt>
							<dd>
								<NumberValue value={Number(commitWeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feePerKw: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const feePerKw = prefetched.feePerKw}
					{#if feePerKw !== undefined && feePerKw !== null}
						<div>
							<dt>fee per kw</dt>
							<dd>
								<NumberValue value={Number(feePerKw)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feePerKw = resolvedEntity.feePerKw}
					{#if feePerKw !== undefined && feePerKw !== null}
						<div>
							<dt>fee per kw</dt>
							<dd>
								<NumberValue value={Number(feePerKw)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							numUpdates: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const numUpdates = prefetched.numUpdates}
					{#if numUpdates !== undefined && numUpdates !== null}
						<div>
							<dt>num updates</dt>
							<dd>
								<NumberValue value={Number(numUpdates)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const numUpdates = resolvedEntity.numUpdates}
					{#if numUpdates !== undefined && numUpdates !== null}
						<div>
							<dt>num updates</dt>
							<dd>
								<NumberValue value={Number(numUpdates)} />
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
