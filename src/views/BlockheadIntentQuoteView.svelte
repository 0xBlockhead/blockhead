<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadIntentQuote>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadIntentQuote>>
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
	const blockheadIntentQuote = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			source: true,
			quoteRequestHash: true,
			providerProtocol: true,
			requestedAt: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.providerProtocol) ?? '')].filter(Boolean).join(' ') || 'blockhead intent quote')
	const viewDomId = $derived('blockhead-intent-quote-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadIntentQuote_TimestampsView from '$/views/BlockheadIntentQuote_TimestampsView.svelte'
	import BlockheadSessionActionView from '$/views/BlockheadSessionActionView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadIntentQuote}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadIntentQuote}>
			{#snippet Pending()}
				{[String((prefetched.providerProtocol) ?? '')].filter(Boolean).join(' ') || title || 'blockhead intent quote'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.providerProtocol) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadIntentQuote}>
			{#snippet Pending()}
				{[String((prefetched.source) ?? '')].filter(Boolean).join(' ') || [String((prefetched.providerProtocol) ?? '')].filter(Boolean).join(' ') || title || 'blockhead intent quote'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.source) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.providerProtocol) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadIntentQuote}>
			{#snippet Pending()}
				{@const requestedAt0 = prefetched.requestedAt}
				{#if requestedAt0 !== undefined && requestedAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(requestedAt0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const requestedAt0 = resolvedEntity.requestedAt}
				{#if requestedAt0 !== undefined && requestedAt0 !== null}
					<span data-text="muted">
						<Timestamp timestamp={Number(requestedAt0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									id: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const id = selection.entitySelector.id ?? prefetched.id}
							{#if id !== undefined && id !== null}
								{String((id) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const id = resolvedEntity.id}
							{#if id !== undefined && id !== null}
								{String((id) ?? '')}
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
							{@const source = prefetched.source}
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

			<div>
				<dt>quote request hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									quoteRequestHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const quoteRequestHash = prefetched.quoteRequestHash}
							{#if quoteRequestHash !== undefined && quoteRequestHash !== null}
								<TruncatedValue value={String((quoteRequestHash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const quoteRequestHash = resolvedEntity.quoteRequestHash}
							{#if quoteRequestHash !== undefined && quoteRequestHash !== null}
								<TruncatedValue value={String((quoteRequestHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.BlockheadSessionAction, false>('$sessionAction')}
			>
				{#snippet children(blockheadSessionAction)}
					{#if blockheadSessionAction != null && blockheadSessionAction[EntityMetaKey.Selector] != null}
						<div>
							<dt>session action</dt>
							<dd>
								<BlockheadSessionActionView
									selection={select(EntityType.BlockheadSessionAction, blockheadSessionAction[EntityMetaKey.Selector])}
									prefetched={blockheadSessionAction}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>provider protocol</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									providerProtocol: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const providerProtocol = prefetched.providerProtocol}
							{#if providerProtocol !== undefined && providerProtocol !== null}
								{String((providerProtocol) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const providerProtocol = resolvedEntity.providerProtocol}
							{#if providerProtocol !== undefined && providerProtocol !== null}
								{String((providerProtocol) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							intentType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const intentType = prefetched.intentType}
					{#if intentType !== undefined && intentType !== null}
						<div>
							<dt>intent type</dt>
							<dd>
								{String((intentType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const intentType = resolvedEntity.intentType}
					{#if intentType !== undefined && intentType !== null}
						<div>
							<dt>intent type</dt>
							<dd>
								{String((intentType) ?? '')}
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
							userInteropAddress: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const userInteropAddress = prefetched.userInteropAddress}
					{#if userInteropAddress !== undefined && userInteropAddress !== null}
						<div>
							<dt>user interop address</dt>
							<dd>
								<TruncatedValue value={String((userInteropAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const userInteropAddress = resolvedEntity.userInteropAddress}
					{#if userInteropAddress !== undefined && userInteropAddress !== null}
						<div>
							<dt>user interop address</dt>
							<dd>
								<TruncatedValue value={String((userInteropAddress) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							requestPayloadHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const requestPayloadHash = prefetched.requestPayloadHash}
					{#if requestPayloadHash !== undefined && requestPayloadHash !== null}
						<div>
							<dt>request payload hash</dt>
							<dd>
								<TruncatedValue value={String((requestPayloadHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const requestPayloadHash = resolvedEntity.requestPayloadHash}
					{#if requestPayloadHash !== undefined && requestPayloadHash !== null}
						<div>
							<dt>request payload hash</dt>
							<dd>
								<TruncatedValue value={String((requestPayloadHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>requested AT</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									requestedAt: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const requestedAt = prefetched.requestedAt}
							{#if requestedAt !== undefined && requestedAt !== null}
								<Timestamp timestamp={Number(requestedAt)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const requestedAt = resolvedEntity.requestedAt}
							{#if requestedAt !== undefined && requestedAt !== null}
								<Timestamp timestamp={Number(requestedAt)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadIntentQuote_TimestampsView
				selection={selection[EntityProxyField]<EntityType.BlockheadIntentQuote_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No quote observations.'
				id='BlockheadIntentQuote_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
