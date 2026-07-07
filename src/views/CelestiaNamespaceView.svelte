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
			selection: EntityProxyResource<typeof schema, EntityType.CelestiaNamespace>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CelestiaNamespace>>
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
	const celestiaNamespace = $derived(selection({
		fields: {
			label: true,
			namespaceVersion: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.label) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.namespaceId ?? prefetched.namespaceId) ?? '')].filter(Boolean).join(' ') || 'celestia namespace')
	const viewDomId = $derived('celestia-namespace-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		<ResourceBoundary resource={celestiaNamespace}>
			{#snippet Pending()}
				{[String((prefetched.label) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.namespaceId ?? prefetched.namespaceId) ?? '')].filter(Boolean).join(' ') || 'celestia namespace'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={celestiaNamespace}>
			{#snippet Pending()}
				{@const namespaceVersion0 = prefetched.namespaceVersion}
				{#if namespaceVersion0 !== undefined && namespaceVersion0 !== null}
					<NumberValue value={Number(namespaceVersion0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const namespaceVersion0 = resolvedEntity.namespaceVersion}
				{#if namespaceVersion0 !== undefined && namespaceVersion0 !== null}
					<NumberValue value={Number(namespaceVersion0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<CelestiaNetworkView
						selection={select(EntityType.CelestiaNetwork, selection.entitySelector.$network, {})}
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
								fields: {
									namespaceId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const namespaceId = selection.entitySelector.namespaceId ?? prefetched.namespaceId}
							{#if namespaceId !== undefined && namespaceId !== null}
								<TruncatedValue value={String((namespaceId) ?? '')} />
							{/if}
						{/snippet}

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
						fields: {
							namespaceVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const namespaceVersion = prefetched.namespaceVersion}
					{#if namespaceVersion !== undefined && namespaceVersion !== null}
						<div>
							<dt>namespace version</dt>
							<dd>
								<NumberValue value={Number(namespaceVersion)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const namespaceVersion = resolvedEntity.namespaceVersion}
					{#if namespaceVersion !== undefined && namespaceVersion !== null}
						<div>
							<dt>namespace version</dt>
							<dd>
								<NumberValue value={Number(namespaceVersion)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							label: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const label = prefetched.label}
					{#if label !== undefined && label !== null}
						<div>
							<dt>Label</dt>
							<dd>
								{String((label) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
		{#if detailsOpen}
			<CelestiaNamespace_TimestampsView
				selection={selection[EntityProxyField]<EntityType.CelestiaNamespace_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No observations yet.'
				id='CelestiaNamespace_TimestampsView-$$timestamps'
			/>

			<CelestiaBlobsView
				selection={selection[EntityProxyField]<EntityType.CelestiaBlob>('$$blobs')}
				title='blobs'
				emptyText='No blobs found.'
				id='CelestiaBlobsView-$$blobs'
			/>
		{/if}
	{/snippet}
</EntityView>
