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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadIntentQuote_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadIntentQuote_Timestamp>>
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
	const blockheadIntentQuoteTimestamp = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			quoteId: true,
			solverId: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.quoteId) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.source ?? prefetched.source) ?? '')].filter(Boolean).join(' ') || 'blockhead intent quote timestamp')
	const viewDomId = $derived('blockhead-intent-quote-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadIntentQuoteView from '$/views/BlockheadIntentQuoteView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadIntentQuote_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadIntentQuoteTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.quoteId) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.source ?? prefetched.source) ?? '')].filter(Boolean).join(' ') || 'blockhead intent quote timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.quoteId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadIntentQuoteTimestamp}>
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

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadIntentQuoteTimestamp}>
			{#snippet Pending()}
				{@const solverId0 = prefetched.solverId}
				{#if solverId0 !== undefined && solverId0 !== null}
					<span data-text="muted">
						{String((solverId0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const solverId0 = resolvedEntity.solverId}
				{#if solverId0 !== undefined && solverId0 !== null}
					<span data-text="muted">
						{String((solverId0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>quote</dt>
				<dd>
					<BlockheadIntentQuoteView
						selection={select(EntityType.BlockheadIntentQuote, selection.entitySelector.$quote)}
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
							quoteId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const quoteId = prefetched.quoteId}
					{#if quoteId !== undefined && quoteId !== null}
						<div>
							<dt>quote ID</dt>
							<dd>
								{String((quoteId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const quoteId = resolvedEntity.quoteId}
					{#if quoteId !== undefined && quoteId !== null}
						<div>
							<dt>quote ID</dt>
							<dd>
								{String((quoteId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							solverId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const solverId = prefetched.solverId}
					{#if solverId !== undefined && solverId !== null}
						<div>
							<dt>solver ID</dt>
							<dd>
								{String((solverId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const solverId = resolvedEntity.solverId}
					{#if solverId !== undefined && solverId !== null}
						<div>
							<dt>solver ID</dt>
							<dd>
								{String((solverId) ?? '')}
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
							validUntil: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const validUntil = prefetched.validUntil}
					{#if validUntil !== undefined && validUntil !== null}
						<div>
							<dt>valid until</dt>
							<dd>
								<Timestamp timestamp={Number(validUntil)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const validUntil = resolvedEntity.validUntil}
					{#if validUntil !== undefined && validUntil !== null}
						<div>
							<dt>valid until</dt>
							<dd>
								<Timestamp timestamp={Number(validUntil)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							estimatedFillSeconds: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const estimatedFillSeconds = prefetched.estimatedFillSeconds}
					{#if estimatedFillSeconds !== undefined && estimatedFillSeconds !== null}
						<div>
							<dt>estimated fill seconds</dt>
							<dd>
								<NumberValue value={Number(estimatedFillSeconds)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const estimatedFillSeconds = resolvedEntity.estimatedFillSeconds}
					{#if estimatedFillSeconds !== undefined && estimatedFillSeconds !== null}
						<div>
							<dt>estimated fill seconds</dt>
							<dd>
								<NumberValue value={Number(estimatedFillSeconds)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							quotePayloadHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const quotePayloadHash = prefetched.quotePayloadHash}
					{#if quotePayloadHash !== undefined && quotePayloadHash !== null}
						<div>
							<dt>quote payload hash</dt>
							<dd>
								<TruncatedValue value={String((quotePayloadHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const quotePayloadHash = resolvedEntity.quotePayloadHash}
					{#if quotePayloadHash !== undefined && quotePayloadHash !== null}
						<div>
							<dt>quote payload hash</dt>
							<dd>
								<TruncatedValue value={String((quotePayloadHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							integrityChecksum: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const integrityChecksum = prefetched.integrityChecksum}
					{#if integrityChecksum !== undefined && integrityChecksum !== null}
						<div>
							<dt>integrity checksum</dt>
							<dd>
								{String((integrityChecksum) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const integrityChecksum = resolvedEntity.integrityChecksum}
					{#if integrityChecksum !== undefined && integrityChecksum !== null}
						<div>
							<dt>integrity checksum</dt>
							<dd>
								{String((integrityChecksum) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const error = prefetched.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const error = resolvedEntity.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
