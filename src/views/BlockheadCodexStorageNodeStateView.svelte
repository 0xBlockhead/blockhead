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
	import { UrlString } from '$/schema/UrlString.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadCodexStorageNodeState>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadCodexStorageNodeState>>
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
	const blockheadCodexStorageNodeState = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			endpoint: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.peerId) ?? '')].filter(Boolean).join(' ') || 'blockhead codex storage node state')
	const viewDomId = $derived('blockhead-codex-storage-node-state-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadCodexStorageNodeState_TimestampsView from '$/views/BlockheadCodexStorageNodeState_TimestampsView.svelte'
	import BlockheadCodexStoredDataEntriesView from '$/views/BlockheadCodexStoredDataEntriesView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadCodexStorageNodeState}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadCodexStorageNodeState}>
			{#snippet Pending()}
				{[String((pendingEntity.peerId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead codex storage node state'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.peerId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadCodexStorageNodeState}>
			{#snippet Pending()}
				{[String((pendingEntity.connectionId) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.peerId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead codex storage node state'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.connectionId) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.peerId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadCodexStorageNodeState}>
			{#snippet Pending()}
				{@const endpoint0 = pendingEntity.endpoint}
				{#if endpoint0 !== undefined && endpoint0 !== null}
					<span data-text="muted">
						<svelte:element
							this={'a'}
							href={String(endpoint0)}
							target="_blank"
							rel="noreferrer noopener"
						>
							<TruncatedValue value={String(endpoint0)} />
						</svelte:element>
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const endpoint0 = resolvedEntity.endpoint}
				{#if endpoint0 !== undefined && endpoint0 !== null}
					<span data-text="muted">
						<svelte:element
							this={'a'}
							href={String(endpoint0)}
							target="_blank"
							rel="noreferrer noopener"
						>
							<TruncatedValue value={String(endpoint0)} />
						</svelte:element>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>connection ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									connectionId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const connectionId = pendingEntity.connectionId}
							{#if connectionId !== undefined && connectionId !== null}
								{String((connectionId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const connectionId = resolvedEntity.connectionId}
							{#if connectionId !== undefined && connectionId !== null}
								{String((connectionId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>peer ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									peerId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const peerId = pendingEntity.peerId}
							{#if peerId !== undefined && peerId !== null}
								{String((peerId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const peerId = resolvedEntity.peerId}
							{#if peerId !== undefined && peerId !== null}
								{String((peerId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							endpoint: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const endpoint = pendingEntity.endpoint}
					{#if endpoint !== undefined && endpoint !== null}
						<div>
							<dt>endpoint</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(endpoint)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(endpoint)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const endpoint = resolvedEntity.endpoint}
					{#if endpoint !== undefined && endpoint !== null}
						<div>
							<dt>endpoint</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(endpoint)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(endpoint)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							signedPeerRecord: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const signedPeerRecord = pendingEntity.signedPeerRecord}
					{#if signedPeerRecord !== undefined && signedPeerRecord !== null}
						<div>
							<dt>signed peer record</dt>
							<dd>
								{String((signedPeerRecord) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const signedPeerRecord = resolvedEntity.signedPeerRecord}
					{#if signedPeerRecord !== undefined && signedPeerRecord !== null}
						<div>
							<dt>signed peer record</dt>
							<dd>
								{String((signedPeerRecord) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadCodexStorageNodeState_TimestampsView
				selection={selection.$$timestamps}
				title='timestamps'
				emptyText='No Codex node-state observations.'
				id='BlockheadCodexStorageNodeState_TimestampsView-timestamps'
			/>

			<BlockheadCodexStoredDataEntriesView
				selection={selection.$$storedData}
				title='Stored Data'
				emptyText='No stored data.'
				id='BlockheadCodexStoredDataEntriesView-stored-data'
			/>
		{/if}
	{/snippet}
</EntityView>
