<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.AvalanchePChainBlock>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AvalanchePChainBlock>>
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
	const avalanchePChainBlock = $derived(selection({
		fields: {
			timestampMs: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.height) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.blockId) ?? '')].filter(Boolean).join(' ') || 'avalanche p chain block')
	const viewDomId = $derived('avalanche-pchain-block-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AvalanchePChainTransactionsView from '$/views/AvalanchePChainTransactionsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.AvalanchePChainBlock}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={avalanchePChainBlock}>
			{#snippet Pending()}
				{@const height0 = pendingEntity.height}
				{#if height0 !== undefined && height0 !== null}
					<NumberValue value={Number(height0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const height0 = resolvedEntity.height}
				{#if height0 !== undefined && height0 !== null}
					<NumberValue value={Number(height0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={avalanchePChainBlock}>
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

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
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
				<dt>Height</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									height: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const height = pendingEntity.height}
							{#if height !== undefined && height !== null}
								<NumberValue value={Number(height)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const height = resolvedEntity.height}
							{#if height !== undefined && height !== null}
								<NumberValue value={Number(height)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>block ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									blockId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const blockId = pendingEntity.blockId}
							{#if blockId !== undefined && blockId !== null}
								<TruncatedValue value={String((blockId) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const blockId = resolvedEntity.blockId}
							{#if blockId !== undefined && blockId !== null}
								<TruncatedValue value={String((blockId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							parentBlockId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const parentBlockId = pendingEntity.parentBlockId}
					{#if parentBlockId !== undefined && parentBlockId !== null}
						<div>
							<dt>parent block ID</dt>
							<dd>
								<TruncatedValue value={String((parentBlockId) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const parentBlockId = resolvedEntity.parentBlockId}
					{#if parentBlockId !== undefined && parentBlockId !== null}
						<div>
							<dt>parent block ID</dt>
							<dd>
								<TruncatedValue value={String((parentBlockId) ?? '')} />
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
							encoding: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const encoding = pendingEntity.encoding}
					{#if encoding !== undefined && encoding !== null}
						<div>
							<dt>encoding</dt>
							<dd>
								{String((encoding) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const encoding = resolvedEntity.encoding}
					{#if encoding !== undefined && encoding !== null}
						<div>
							<dt>encoding</dt>
							<dd>
								{String((encoding) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							txCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const txCount = pendingEntity.txCount}
					{#if txCount !== undefined && txCount !== null}
						<div>
							<dt>transaction count</dt>
							<dd>
								<NumberValue value={Number(txCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const txCount = resolvedEntity.txCount}
					{#if txCount !== undefined && txCount !== null}
						<div>
							<dt>transaction count</dt>
							<dd>
								<NumberValue value={Number(txCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<AvalanchePChainTransactionsView
				selection={selection.$$transactions}
				title='transactions'
				emptyText='No transactions found.'
				id='AvalanchePChainTransactionsView-transactions'
			/>
		{/if}
	{/snippet}
</EntityView>
