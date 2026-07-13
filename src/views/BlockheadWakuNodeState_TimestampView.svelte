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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadWakuNodeState_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadWakuNodeState_Timestamp>>
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
	const blockheadWakuNodeStateTimestamp = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			health: true,
			peerCount: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead waku node state timestamp')
	const viewDomId = $derived('blockhead-waku-node-state-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadWakuNodeStateView from '$/views/BlockheadWakuNodeStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadWakuNodeState_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadWakuNodeStateTimestamp}>
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
		<ResourceBoundary resource={blockheadWakuNodeStateTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.health) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'blockhead waku node state timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.health) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadWakuNodeStateTimestamp}>
			{#snippet Pending()}
				{@const peerCount0 = pendingEntity.peerCount}
				{#if peerCount0 !== undefined && peerCount0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(peerCount0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const peerCount0 = resolvedEntity.peerCount}
				{#if peerCount0 !== undefined && peerCount0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(peerCount0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>node state</dt>
				<dd>
					<BlockheadWakuNodeStateView
						selection={select(EntityType.BlockheadWakuNodeState, selection.entitySelector.$nodeState, {})}
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
							health: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const health = pendingEntity.health}
					{#if health !== undefined && health !== null}
						<div>
							<dt>health</dt>
							<dd>
								{String((health) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const health = resolvedEntity.health}
					{#if health !== undefined && health !== null}
						<div>
							<dt>health</dt>
							<dd>
								{String((health) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							version: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const version = pendingEntity.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>version</dt>
							<dd>
								{String((version) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const version = resolvedEntity.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>version</dt>
							<dd>
								{String((version) ?? '')}
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
							peerCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const peerCount = pendingEntity.peerCount}
					{#if peerCount !== undefined && peerCount !== null}
						<div>
							<dt>peer count</dt>
							<dd>
								<NumberValue value={Number(peerCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const peerCount = resolvedEntity.peerCount}
					{#if peerCount !== undefined && peerCount !== null}
						<div>
							<dt>peer count</dt>
							<dd>
								<NumberValue value={Number(peerCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>listen addresses</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									listenAddresses: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const listenAddresses = pendingEntity.listenAddresses}
							{#if listenAddresses !== undefined && listenAddresses !== null}
								<TruncatedValue value={listenAddresses.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const listenAddresses = resolvedEntity.listenAddresses}
							{#if listenAddresses !== undefined && listenAddresses !== null}
								<TruncatedValue value={listenAddresses.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							enrUri: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const enrUri = pendingEntity.enrUri}
					{#if enrUri !== undefined && enrUri !== null}
						<div>
							<dt>ENR URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(enrUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(enrUri)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const enrUri = resolvedEntity.enrUri}
					{#if enrUri !== undefined && enrUri !== null}
						<div>
							<dt>ENR URI</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(enrUri)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(enrUri)} />
								</svelte:element>
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
							relayEnabled: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const relayEnabled = pendingEntity.relayEnabled}
					{#if relayEnabled !== undefined && relayEnabled !== null}
						<div>
							<dt>relay enabled</dt>
							<dd>
								{relayEnabled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const relayEnabled = resolvedEntity.relayEnabled}
					{#if relayEnabled !== undefined && relayEnabled !== null}
						<div>
							<dt>relay enabled</dt>
							<dd>
								{relayEnabled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							storeEnabled: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const storeEnabled = pendingEntity.storeEnabled}
					{#if storeEnabled !== undefined && storeEnabled !== null}
						<div>
							<dt>store enabled</dt>
							<dd>
								{storeEnabled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const storeEnabled = resolvedEntity.storeEnabled}
					{#if storeEnabled !== undefined && storeEnabled !== null}
						<div>
							<dt>store enabled</dt>
							<dd>
								{storeEnabled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							filterEnabled: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const filterEnabled = pendingEntity.filterEnabled}
					{#if filterEnabled !== undefined && filterEnabled !== null}
						<div>
							<dt>filter enabled</dt>
							<dd>
								{filterEnabled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const filterEnabled = resolvedEntity.filterEnabled}
					{#if filterEnabled !== undefined && filterEnabled !== null}
						<div>
							<dt>filter enabled</dt>
							<dd>
								{filterEnabled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lightpushEnabled: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lightpushEnabled = pendingEntity.lightpushEnabled}
					{#if lightpushEnabled !== undefined && lightpushEnabled !== null}
						<div>
							<dt>lightpush enabled</dt>
							<dd>
								{lightpushEnabled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lightpushEnabled = resolvedEntity.lightpushEnabled}
					{#if lightpushEnabled !== undefined && lightpushEnabled !== null}
						<div>
							<dt>lightpush enabled</dt>
							<dd>
								{lightpushEnabled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rlnRelayEnabled: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const rlnRelayEnabled = pendingEntity.rlnRelayEnabled}
					{#if rlnRelayEnabled !== undefined && rlnRelayEnabled !== null}
						<div>
							<dt>RLN relay enabled</dt>
							<dd>
								{rlnRelayEnabled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rlnRelayEnabled = resolvedEntity.rlnRelayEnabled}
					{#if rlnRelayEnabled !== undefined && rlnRelayEnabled !== null}
						<div>
							<dt>RLN relay enabled</dt>
							<dd>
								{rlnRelayEnabled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>subscribed pubsub topics</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									subscribedPubsubTopics: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const subscribedPubsubTopics = pendingEntity.subscribedPubsubTopics}
							{#if subscribedPubsubTopics !== undefined && subscribedPubsubTopics !== null}
								{subscribedPubsubTopics.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const subscribedPubsubTopics = resolvedEntity.subscribedPubsubTopics}
							{#if subscribedPubsubTopics !== undefined && subscribedPubsubTopics !== null}
								{subscribedPubsubTopics.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>subscribed content topics</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									subscribedContentTopics: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const subscribedContentTopics = pendingEntity.subscribedContentTopics}
							{#if subscribedContentTopics !== undefined && subscribedContentTopics !== null}
								{subscribedContentTopics.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const subscribedContentTopics = resolvedEntity.subscribedContentTopics}
							{#if subscribedContentTopics !== undefined && subscribedContentTopics !== null}
								{subscribedContentTopics.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
