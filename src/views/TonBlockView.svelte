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
			selection: EntityProxyResource<typeof schema, EntityType.TonBlock>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.TonBlock>>
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
	const tonBlock = $derived(selection({}))
	const titleFallback = $derived('TON block')
	const viewDomId = $derived('ton-block-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TonNetworkView from '$/views/TonNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.TonBlock}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={tonBlock}>
			{#snippet Pending()}
				{title || 'TON block'}
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
				<dt>network</dt>
				<dd>
					<TonNetworkView
						selection={select(EntityType.TonNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>workchain</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									workchain: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const workchain = prefetched.workchain}
							{#if workchain !== undefined && workchain !== null}
								{String((workchain) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const workchain = resolvedEntity.workchain}
							{#if workchain !== undefined && workchain !== null}
								{String((workchain) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
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
							{@const shardPrefix = prefetched.shardPrefix}
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
							{@const seqno = prefetched.seqno}
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
					{@const rootHash = prefetched.rootHash}
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
					{@const fileHash = prefetched.fileHash}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							genUtimeMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const genUtimeMs = prefetched.genUtimeMs}
					{#if genUtimeMs !== undefined && genUtimeMs !== null}
						<div>
							<dt>gen utime ms</dt>
							<dd>
								{String((genUtimeMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const genUtimeMs = resolvedEntity.genUtimeMs}
					{#if genUtimeMs !== undefined && genUtimeMs !== null}
						<div>
							<dt>gen utime ms</dt>
							<dd>
								{String((genUtimeMs) ?? '')}
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
					{@const startLt = prefetched.startLt}
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
					{@const endLt = prefetched.endLt}
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
					{@const minRefMcSeqno = prefetched.minRefMcSeqno}
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
		</dl>
	{/snippet}
</EntityView>
