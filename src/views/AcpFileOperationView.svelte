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
			selection: EntityProxyResource<typeof schema, EntityType.AcpFileOperation>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AcpFileOperation>>
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
	const acpFileOperation = $derived(selection({
		sources: [
			Source.AcpLocal_JsonRpc,
		],
		fields: {
			operationKind: true,
			path: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.operationId) ?? '')].filter(Boolean).join(' ') || 'ACP file operation')
	const viewDomId = $derived('acp-file-operation-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AcpSessionView from '$/views/AcpSessionView.svelte'
</script>


<EntityView
	entityType={EntityType.AcpFileOperation}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={acpFileOperation}>
			{#snippet Pending()}
				{[String((pendingEntity.operationId) ?? '')].filter(Boolean).join(' ') || title || 'ACP file operation'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.operationId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={acpFileOperation}>
			{#snippet Pending()}
				{[String((pendingEntity.operationKind) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.operationId) ?? '')].filter(Boolean).join(' ') || title || 'ACP file operation'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.operationKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.operationId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={acpFileOperation}>
			{#snippet Pending()}
				{@const path0 = pendingEntity.path}
				{#if path0 !== undefined && path0 !== null}
					<span data-text="muted">
						{String((path0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const path0 = resolvedEntity.path}
				{#if path0 !== undefined && path0 !== null}
					<span data-text="muted">
						{String((path0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>session</dt>
				<dd>
					<AcpSessionView
						selection={select(EntityType.AcpSession, selection.entitySelector.$session, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>operation ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									operationId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const operationId = pendingEntity.operationId}
							{#if operationId !== undefined && operationId !== null}
								{String((operationId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const operationId = resolvedEntity.operationId}
							{#if operationId !== undefined && operationId !== null}
								{String((operationId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>operation kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									operationKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const operationKind = pendingEntity.operationKind}
							{#if operationKind !== undefined && operationKind !== null}
								{String((operationKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const operationKind = resolvedEntity.operationKind}
							{#if operationKind !== undefined && operationKind !== null}
								{String((operationKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							path: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const path = pendingEntity.path}
					{#if path !== undefined && path !== null}
						<div>
							<dt>path</dt>
							<dd>
								{String((path) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const path = resolvedEntity.path}
					{#if path !== undefined && path !== null}
						<div>
							<dt>path</dt>
							<dd>
								{String((path) ?? '')}
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
							startLine: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const startLine = pendingEntity.startLine}
					{#if startLine !== undefined && startLine !== null}
						<div>
							<dt>start line</dt>
							<dd>
								<NumberValue value={Number(startLine)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const startLine = resolvedEntity.startLine}
					{#if startLine !== undefined && startLine !== null}
						<div>
							<dt>start line</dt>
							<dd>
								<NumberValue value={Number(startLine)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							endLine: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const endLine = pendingEntity.endLine}
					{#if endLine !== undefined && endLine !== null}
						<div>
							<dt>end line</dt>
							<dd>
								<NumberValue value={Number(endLine)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const endLine = resolvedEntity.endLine}
					{#if endLine !== undefined && endLine !== null}
						<div>
							<dt>end line</dt>
							<dd>
								<NumberValue value={Number(endLine)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							contentHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const contentHashAlgorithm = pendingEntity.contentHashAlgorithm}
					{#if contentHashAlgorithm !== undefined && contentHashAlgorithm !== null}
						<div>
							<dt>content hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((contentHashAlgorithm) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const contentHashAlgorithm = resolvedEntity.contentHashAlgorithm}
					{#if contentHashAlgorithm !== undefined && contentHashAlgorithm !== null}
						<div>
							<dt>content hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((contentHashAlgorithm) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							contentHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const contentHash = pendingEntity.contentHash}
					{#if contentHash !== undefined && contentHash !== null}
						<div>
							<dt>content hash</dt>
							<dd>
								<TruncatedValue value={String((contentHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const contentHash = resolvedEntity.contentHash}
					{#if contentHash !== undefined && contentHash !== null}
						<div>
							<dt>content hash</dt>
							<dd>
								<TruncatedValue value={String((contentHash) ?? '')} />
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
	{/snippet}
</EntityView>
