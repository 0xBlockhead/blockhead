<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.NearChunk>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.NearChunk>>
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
		sources: selection.sources,
		fields: {
			shardId: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.chunkHash) ?? '')].filter(Boolean).join(' ') || 'near chunk')
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
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const chunkHash0 = pendingEntity.chunkHash}
					{#if chunkHash0 !== undefined && chunkHash0 !== null}
						<TruncatedValue value={String((chunkHash0) ?? '')} />
					{/if}
		{:else}
			<ResourceBoundary resource={nearChunk}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const chunkHash0 = resolvedEntity.chunkHash}
					{#if chunkHash0 !== undefined && chunkHash0 !== null}
						<TruncatedValue value={String((chunkHash0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					<ResourceBoundary
						resource={selection.$block}
					>
						{#snippet children(nearBlock)}
							{#if nearBlock != null && nearBlock[EntityMetaKey.Selector] != null}
								<NearBlockView
									selection={select(EntityType.NearBlock, nearBlock[EntityMetaKey.Selector])}
									prefetched={nearBlock}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
		{:else}
			<ResourceBoundary resource={nearChunk}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ResourceBoundary
						resource={selection.$block}
					>
						{#snippet children(nearBlock)}
							{#if nearBlock != null && nearBlock[EntityMetaKey.Selector] != null}
								<NearBlockView
									selection={select(EntityType.NearBlock, nearBlock[EntityMetaKey.Selector])}
									prefetched={nearBlock}
									layout={EntityLayout.Value}
									open={false}
								/>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const shardId0 = pendingEntity.shardId}
			{#if shardId0 !== undefined && shardId0 !== null}
				<span data-text="muted">
					<NumberValue
						value={shardId0}
					/>
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={nearChunk}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const shardId0 = resolvedEntity.shardId}
					{#if shardId0 !== undefined && shardId0 !== null}
						<span data-text="muted">
							<NumberValue
								value={shardId0}
							/>
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
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
								sources: selection.sources,
								fields: {
									chunkHash: true,
								},
							})
						}
					>
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
				resource={selection.$block}
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
						sources: selection.sources,
						fields: {
							shardId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const shardId = resolvedEntity.shardId}
					{#if shardId !== undefined && shardId !== null}
						<div>
							<dt>Shard ID</dt>
							<dd>
								<NumberValue
									value={shardId}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							gasUsed: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const gasUsed = resolvedEntity.gasUsed}
					{#if gasUsed !== undefined && gasUsed !== null}
						<div>
							<dt>Gas used</dt>
							<dd>
								<NumberValue
									value={gasUsed}
								/>
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
						selection.$$transactions({
							sources: [
								Source.NearRpc_JsonRpc,
							],
							count: true,
						})
					}
				title='Transactions'
				id='NearTransactionsView-transactions'
			/>
		{/if}
	{/snippet}
</EntityView>
