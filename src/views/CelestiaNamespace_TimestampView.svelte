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
			selection: EntityProxyResource<typeof schema, EntityType.CelestiaNamespace_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CelestiaNamespace_Timestamp>>
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
	const celestiaNamespaceTimestamp = $derived(selection({
		fields: {
			height: true,
			blobCount: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'celestia namespace timestamp')
	const viewDomId = $derived('celestia-namespace-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import CelestiaNamespaceView from '$/views/CelestiaNamespaceView.svelte'
</script>


<EntityView
	entityType={EntityType.CelestiaNamespace_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={celestiaNamespaceTimestamp}>
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
		<ResourceBoundary resource={celestiaNamespaceTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.height) ?? ''), String((pendingEntity.blobCount) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'celestia namespace timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.height) ?? ''), String((resolvedEntity.blobCount) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={celestiaNamespaceTimestamp}>
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
				<dt>Namespace</dt>
				<dd>
					<CelestiaNamespaceView
						selection={select(EntityType.CelestiaNamespace, selection.entitySelector.$namespace, {})}
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
							height: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const height = pendingEntity.height}
					{#if height !== undefined && height !== null}
						<div>
							<dt>Height</dt>
							<dd>
								<NumberValue value={Number(height)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const height = resolvedEntity.height}
					{#if height !== undefined && height !== null}
						<div>
							<dt>Height</dt>
							<dd>
								<NumberValue value={Number(height)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							blobCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blobCount = pendingEntity.blobCount}
					{#if blobCount !== undefined && blobCount !== null}
						<div>
							<dt>blob count</dt>
							<dd>
								<NumberValue value={Number(blobCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blobCount = resolvedEntity.blobCount}
					{#if blobCount !== undefined && blobCount !== null}
						<div>
							<dt>blob count</dt>
							<dd>
								<NumberValue value={Number(blobCount)} />
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
							observedStartHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const observedStartHeight = pendingEntity.observedStartHeight}
					{#if observedStartHeight !== undefined && observedStartHeight !== null}
						<div>
							<dt>observed start height</dt>
							<dd>
								<NumberValue value={Number(observedStartHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observedStartHeight = resolvedEntity.observedStartHeight}
					{#if observedStartHeight !== undefined && observedStartHeight !== null}
						<div>
							<dt>observed start height</dt>
							<dd>
								<NumberValue value={Number(observedStartHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							observedEndHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const observedEndHeight = pendingEntity.observedEndHeight}
					{#if observedEndHeight !== undefined && observedEndHeight !== null}
						<div>
							<dt>observed end height</dt>
							<dd>
								<NumberValue value={Number(observedEndHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observedEndHeight = resolvedEntity.observedEndHeight}
					{#if observedEndHeight !== undefined && observedEndHeight !== null}
						<div>
							<dt>observed end height</dt>
							<dd>
								<NumberValue value={Number(observedEndHeight)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
