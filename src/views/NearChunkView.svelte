<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.NearChunk>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.NearChunk>>
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
	const nearChunk = $derived(selection({
		sources: [
			Source.NearRpc_JsonRpc,
		],
		fields: {
			$block: true,
			shardId: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.chunkHash ?? prefetched.chunkHash) ?? '')].filter(Boolean).join(' ') || 'near chunk')
	const viewDomId = $derived('near-chunk-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NearTransactionsView from '$/views/NearTransactionsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import NearBlockView from '$/views/NearBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.NearChunk}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={nearChunk}>
			{#snippet Pending()}
				{@const chunkHash0 = selection.entitySelector.chunkHash ?? prefetched.chunkHash}
				{#if chunkHash0 !== undefined && chunkHash0 !== null}
					<TruncatedValue value={String((chunkHash0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const chunkHash0 = resolvedEntity.chunkHash}
				{#if chunkHash0 !== undefined && chunkHash0 !== null}
					<TruncatedValue value={String((chunkHash0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={nearChunk}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.NearBlock, false>('$block')}
				>
					{#snippet children(nearBlock)}
						{#if nearBlock != null && nearBlock[EntityMetaKey.Selector] != null}
							<NearBlockView
								selection={select(EntityType.NearBlock, nearBlock[EntityMetaKey.Selector])}
								prefetched={nearBlock}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.NearBlock, false>('$block')}
				>
					{#snippet children(nearBlock)}
						{#if nearBlock != null && nearBlock[EntityMetaKey.Selector] != null}
							<NearBlockView
								selection={select(EntityType.NearBlock, nearBlock[EntityMetaKey.Selector])}
								prefetched={nearBlock}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nearChunk}>
			{#snippet Pending()}
				{@const shardId0 = prefetched.shardId}
				{#if shardId0 !== undefined && shardId0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(shardId0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const shardId0 = resolvedEntity.shardId}
				{#if shardId0 !== undefined && shardId0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(shardId0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Chunk hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									chunkHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const chunkHash = selection.entitySelector.chunkHash ?? prefetched.chunkHash}
							{#if chunkHash !== undefined && chunkHash !== null}
								<TruncatedValue value={String((chunkHash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const chunkHash = resolvedEntity.chunkHash}
							{#if chunkHash !== undefined && chunkHash !== null}
								<TruncatedValue value={String((chunkHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.NearBlock, false>('$block')}
			>
				{#snippet children(nearBlock)}
					{#if nearBlock != null && nearBlock[EntityMetaKey.Selector] != null}
						<div>
							<dt>Block</dt>
							<dd>
								<NearBlockView
									selection={select(EntityType.NearBlock, nearBlock[EntityMetaKey.Selector])}
									prefetched={nearBlock}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							shardId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const shardId = prefetched.shardId}
					{#if shardId !== undefined && shardId !== null}
						<div>
							<dt>Shard ID</dt>
							<dd>
								<NumberValue value={Number(shardId)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const shardId = resolvedEntity.shardId}
					{#if shardId !== undefined && shardId !== null}
						<div>
							<dt>Shard ID</dt>
							<dd>
								<NumberValue value={Number(shardId)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.NearRpc_JsonRpc,
						],
						fields: {
							gasUsed: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const gasUsed = prefetched.gasUsed}
					{#if gasUsed !== undefined && gasUsed !== null}
						<div>
							<dt>Gas used</dt>
							<dd>
								<NumberValue value={Number(gasUsed)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasUsed = resolvedEntity.gasUsed}
					{#if gasUsed !== undefined && gasUsed !== null}
						<div>
							<dt>Gas used</dt>
							<dd>
								<NumberValue value={Number(gasUsed)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<NearTransactionsView
				selection={
						selection[EntityProxyField]<EntityType.NearTransaction>('$$transactions', {
							sources: [
								Source.NearRpc_JsonRpc,
							],
						})
					}
				title='Transactions'
				id='NearTransactionsView-$$transactions'
			/>
		{/if}
	{/snippet}
</EntityView>
