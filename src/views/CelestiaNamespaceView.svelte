<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


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
			selection: RegisteredEntityProxyResource<EntityType.CelestiaNamespace>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.CelestiaNamespace>
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
	const celestiaNamespace = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			label: true,
			namespaceVersion: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			label: true,
			namespaceVersion: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.namespaceId) ?? '')].filter(Boolean).join(' ') || 'celestia namespace')
	const viewDomId = $derived('celestia-namespace-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CelestiaNamespace_TimestampsView from '$/views/CelestiaNamespace_TimestampsView.svelte'
	import CelestiaBlobsView from '$/views/CelestiaBlobsView.svelte'
	import CelestiaNetworkView from '$/views/CelestiaNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CelestiaNamespace}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'label') && Object.hasOwn(prefetched, 'namespaceVersion')}
			{[String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={celestiaNamespace}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'label') && Object.hasOwn(prefetched, 'namespaceVersion')}
			{@const namespaceVersion0 = pendingEntity.namespaceVersion}
			{#if namespaceVersion0 !== undefined && namespaceVersion0 !== null}
				<NumberValue
					value={namespaceVersion0}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={celestiaNamespace}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const namespaceVersion0 = resolvedEntity.namespaceVersion}
					{#if namespaceVersion0 !== undefined && namespaceVersion0 !== null}
						<NumberValue
							value={namespaceVersion0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<CelestiaNetworkView
						selection={select(EntityType.CelestiaNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>namespace ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									namespaceId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const namespaceId = resolvedEntity.namespaceId}
							{#if namespaceId !== undefined && namespaceId !== null}
								<TruncatedValue value={String((namespaceId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							namespaceVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const namespaceVersion = resolvedEntity.namespaceVersion}
					{#if namespaceVersion !== undefined && namespaceVersion !== null}
						<div>
							<dt>namespace version</dt>
							<dd>
								<NumberValue
									value={namespaceVersion}
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
							label: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const label = resolvedEntity.label}
					{#if label !== undefined && label !== null}
						<div>
							<dt>Label</dt>
							<dd>
								{String((label) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const celestiaNamespaceCelestiaNamespaceTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={celestiaNamespaceCelestiaNamespaceTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<CelestiaNamespace_TimestampsView
					selection={celestiaNamespaceCelestiaNamespaceTimestampsViewTimestampsResource}
					countResource={celestiaNamespaceCelestiaNamespaceTimestampsViewTimestampsResource.count}
					title='timestamps'
					id='CelestiaNamespace_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const celestiaNamespaceCelestiaBlobsViewBlobsResource = selection.$$blobs}
		<ResourceBoundary
			resource={celestiaNamespaceCelestiaBlobsViewBlobsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<CelestiaBlobsView
					selection={celestiaNamespaceCelestiaBlobsViewBlobsResource}
					countResource={celestiaNamespaceCelestiaBlobsViewBlobsResource.count}
					title='blobs'
					id='CelestiaBlobsView-blobs'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
