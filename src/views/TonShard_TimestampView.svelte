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
			selection: EntityProxyResource<typeof schema, EntityType.TonShard_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TonShard_Timestamp>>
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
	const tonShardTimestamp = $derived(selection({}))
	const titleFallback = $derived('TON shard timestamp')
	const viewDomId = $derived('ton-shard-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TonWorkchainView from '$/views/TonWorkchainView.svelte'
</script>


<EntityView
	entityType={EntityType.TonShard_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tonShardTimestamp}>
			{#snippet Pending()}
				{title || 'TON shard timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>workchain</dt>
				<dd>
					<TonWorkchainView
						selection={select(EntityType.TonWorkchain, selection.entitySelector.$workchain, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>shard prefix</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									shardPrefix: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const shardPrefix = pendingEntity.shardPrefix}
							{#if shardPrefix !== undefined && shardPrefix !== null}
								{String((shardPrefix) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const shardPrefix = resolvedEntity.shardPrefix}
							{#if shardPrefix !== undefined && shardPrefix !== null}
								{String((shardPrefix) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>seqno</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									seqno: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const seqno = pendingEntity.seqno}
							{#if seqno !== undefined && seqno !== null}
								{String((seqno) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const seqno = resolvedEntity.seqno}
							{#if seqno !== undefined && seqno !== null}
								{String((seqno) ?? '')}
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
							timestampMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const timestampMs = pendingEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs = resolvedEntity.timestampMs}
					{#if timestampMs !== undefined && timestampMs !== null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							startLt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const startLt = pendingEntity.startLt}
					{#if startLt !== undefined && startLt !== null}
						<div>
							<dt>start lt</dt>
							<dd>
								{String((startLt) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const startLt = resolvedEntity.startLt}
					{#if startLt !== undefined && startLt !== null}
						<div>
							<dt>start lt</dt>
							<dd>
								{String((startLt) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							endLt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const endLt = pendingEntity.endLt}
					{#if endLt !== undefined && endLt !== null}
						<div>
							<dt>end lt</dt>
							<dd>
								{String((endLt) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const endLt = resolvedEntity.endLt}
					{#if endLt !== undefined && endLt !== null}
						<div>
							<dt>end lt</dt>
							<dd>
								{String((endLt) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							minRefMcSeqno: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const minRefMcSeqno = pendingEntity.minRefMcSeqno}
					{#if minRefMcSeqno !== undefined && minRefMcSeqno !== null}
						<div>
							<dt>min ref mc seqno</dt>
							<dd>
								{String((minRefMcSeqno) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const minRefMcSeqno = resolvedEntity.minRefMcSeqno}
					{#if minRefMcSeqno !== undefined && minRefMcSeqno !== null}
						<div>
							<dt>min ref mc seqno</dt>
							<dd>
								{String((minRefMcSeqno) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rootHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const rootHash = pendingEntity.rootHash}
					{#if rootHash !== undefined && rootHash !== null}
						<div>
							<dt>root hash</dt>
							<dd>
								<TruncatedValue value={String((rootHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rootHash = resolvedEntity.rootHash}
					{#if rootHash !== undefined && rootHash !== null}
						<div>
							<dt>root hash</dt>
							<dd>
								<TruncatedValue value={String((rootHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							fileHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const fileHash = pendingEntity.fileHash}
					{#if fileHash !== undefined && fileHash !== null}
						<div>
							<dt>file hash</dt>
							<dd>
								<TruncatedValue value={String((fileHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fileHash = resolvedEntity.fileHash}
					{#if fileHash !== undefined && fileHash !== null}
						<div>
							<dt>file hash</dt>
							<dd>
								<TruncatedValue value={String((fileHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
