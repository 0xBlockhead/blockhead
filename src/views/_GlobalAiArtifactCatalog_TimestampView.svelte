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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalAiArtifactCatalog_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType._GlobalAiArtifactCatalog_Timestamp>>
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
	const globalAiArtifactCatalogTimestamp = $derived(selection({
		fields: {
			status: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'global AI artifact catalog timestamp')
	const viewDomId = $derived('-global-ai-artifact-catalog-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GlobalAiArtifactCatalogView from '$/views/_GlobalAiArtifactCatalogView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalAiArtifactCatalog_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={globalAiArtifactCatalogTimestamp}>
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
		<ResourceBoundary resource={globalAiArtifactCatalogTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.status) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'global AI artifact catalog timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.status) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={globalAiArtifactCatalogTimestamp}>
			{#snippet Pending()}
				{@const source0 = pendingEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const source0 = resolvedEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>catalog</dt>
				<dd>
					<GlobalAiArtifactCatalogView
						selection={select(EntityType._GlobalAiArtifactCatalog, selection.entitySelector.$catalog, {})}
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
							status: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const status = pendingEntity.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const status = resolvedEntity.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>status</dt>
							<dd>
								{String((status) ?? '')}
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
					{@const error = pendingEntity.error}
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

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceReportedArtifactCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceReportedArtifactCount = pendingEntity.sourceReportedArtifactCount}
					{#if sourceReportedArtifactCount !== undefined && sourceReportedArtifactCount !== null}
						<div>
							<dt>sourceReportedArtifactCount</dt>
							<dd>
								<NumberValue value={Number(sourceReportedArtifactCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceReportedArtifactCount = resolvedEntity.sourceReportedArtifactCount}
					{#if sourceReportedArtifactCount !== undefined && sourceReportedArtifactCount !== null}
						<div>
							<dt>sourceReportedArtifactCount</dt>
							<dd>
								<NumberValue value={Number(sourceReportedArtifactCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							seededArtifactCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const seededArtifactCount = pendingEntity.seededArtifactCount}
					{#if seededArtifactCount !== undefined && seededArtifactCount !== null}
						<div>
							<dt>seededArtifactCount</dt>
							<dd>
								<NumberValue value={Number(seededArtifactCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const seededArtifactCount = resolvedEntity.seededArtifactCount}
					{#if seededArtifactCount !== undefined && seededArtifactCount !== null}
						<div>
							<dt>seededArtifactCount</dt>
							<dd>
								<NumberValue value={Number(seededArtifactCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceReportedDocumentCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceReportedDocumentCount = pendingEntity.sourceReportedDocumentCount}
					{#if sourceReportedDocumentCount !== undefined && sourceReportedDocumentCount !== null}
						<div>
							<dt>sourceReportedDocumentCount</dt>
							<dd>
								<NumberValue value={Number(sourceReportedDocumentCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceReportedDocumentCount = resolvedEntity.sourceReportedDocumentCount}
					{#if sourceReportedDocumentCount !== undefined && sourceReportedDocumentCount !== null}
						<div>
							<dt>sourceReportedDocumentCount</dt>
							<dd>
								<NumberValue value={Number(sourceReportedDocumentCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							seededDocumentCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const seededDocumentCount = pendingEntity.seededDocumentCount}
					{#if seededDocumentCount !== undefined && seededDocumentCount !== null}
						<div>
							<dt>seededDocumentCount</dt>
							<dd>
								<NumberValue value={Number(seededDocumentCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const seededDocumentCount = resolvedEntity.seededDocumentCount}
					{#if seededDocumentCount !== undefined && seededDocumentCount !== null}
						<div>
							<dt>seededDocumentCount</dt>
							<dd>
								<NumberValue value={Number(seededDocumentCount)} />
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
							declaredEndpointCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const declaredEndpointCount = pendingEntity.declaredEndpointCount}
					{#if declaredEndpointCount !== undefined && declaredEndpointCount !== null}
						<div>
							<dt>declaredEndpointCount</dt>
							<dd>
								<NumberValue value={Number(declaredEndpointCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const declaredEndpointCount = resolvedEntity.declaredEndpointCount}
					{#if declaredEndpointCount !== undefined && declaredEndpointCount !== null}
						<div>
							<dt>declaredEndpointCount</dt>
							<dd>
								<NumberValue value={Number(declaredEndpointCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							reachableEndpointCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const reachableEndpointCount = pendingEntity.reachableEndpointCount}
					{#if reachableEndpointCount !== undefined && reachableEndpointCount !== null}
						<div>
							<dt>reachableEndpointCount</dt>
							<dd>
								<NumberValue value={Number(reachableEndpointCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const reachableEndpointCount = resolvedEntity.reachableEndpointCount}
					{#if reachableEndpointCount !== undefined && reachableEndpointCount !== null}
						<div>
							<dt>reachableEndpointCount</dt>
							<dd>
								<NumberValue value={Number(reachableEndpointCount)} />
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
							queryHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const queryHashAlgorithm = pendingEntity.queryHashAlgorithm}
					{#if queryHashAlgorithm !== undefined && queryHashAlgorithm !== null}
						<div>
							<dt>query hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((queryHashAlgorithm) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const queryHashAlgorithm = resolvedEntity.queryHashAlgorithm}
					{#if queryHashAlgorithm !== undefined && queryHashAlgorithm !== null}
						<div>
							<dt>query hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((queryHashAlgorithm) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							queryHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const queryHash = pendingEntity.queryHash}
					{#if queryHash !== undefined && queryHash !== null}
						<div>
							<dt>query hash</dt>
							<dd>
								<TruncatedValue value={String((queryHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const queryHash = resolvedEntity.queryHash}
					{#if queryHash !== undefined && queryHash !== null}
						<div>
							<dt>query hash</dt>
							<dd>
								<TruncatedValue value={String((queryHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastCursor: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lastCursor = pendingEntity.lastCursor}
					{#if lastCursor !== undefined && lastCursor !== null}
						<div>
							<dt>last cursor</dt>
							<dd>
								{String((lastCursor) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastCursor = resolvedEntity.lastCursor}
					{#if lastCursor !== undefined && lastCursor !== null}
						<div>
							<dt>last cursor</dt>
							<dd>
								{String((lastCursor) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
