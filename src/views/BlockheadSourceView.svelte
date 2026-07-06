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
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadSource>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadSource>>
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
	const blockheadSource = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			label: true,
			source: true,
			provider: true,
			endpointUrl: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.label) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.id ?? prefetched.id) ?? '')].filter(Boolean).join(' ') || 'source')
	const viewDomId = $derived('blockhead-source-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadSource_TimestampsView from '$/views/BlockheadSource_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSource}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadSource}>
			{#snippet Pending()}
				{[String((prefetched.label) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.id ?? prefetched.id) ?? '')].filter(Boolean).join(' ') || 'source'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadSource}>
			{#snippet Pending()}
				{[String((prefetched.source) ?? '')].filter(Boolean).join(' ') || [String((prefetched.label) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.id ?? prefetched.id) ?? '')].filter(Boolean).join(' ') || 'source'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.source) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
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
						<div>
							<dt>Source</dt>
							<dd>
								{String((source) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const source = resolvedEntity.source}
					{#if source !== undefined && source !== null}
						<div>
							<dt>Source</dt>
							<dd>
								{String((source) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							provider: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const provider = prefetched.provider}
					{#if provider !== undefined && provider !== null}
						<div>
							<dt>Provider</dt>
							<dd>
								{String((provider) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const provider = resolvedEntity.provider}
					{#if provider !== undefined && provider !== null}
						<div>
							<dt>Provider</dt>
							<dd>
								{String((provider) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							endpointUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const endpointUrl = prefetched.endpointUrl}
					{#if endpointUrl !== undefined && endpointUrl !== null}
						<div>
							<dt>Endpoint URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(endpointUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(endpointUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const endpointUrl = resolvedEntity.endpointUrl}
					{#if endpointUrl !== undefined && endpointUrl !== null}
						<div>
							<dt>Endpoint URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(endpointUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(endpointUrl)} />
								</svelte:element>
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
							transportKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transportKind = prefetched.transportKind}
					{#if transportKind !== undefined && transportKind !== null}
						<div>
							<dt>Transport</dt>
							<dd>
								{String((transportKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transportKind = resolvedEntity.transportKind}
					{#if transportKind !== undefined && transportKind !== null}
						<div>
							<dt>Transport</dt>
							<dd>
								{String((transportKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							authKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const authKind = prefetched.authKind}
					{#if authKind !== undefined && authKind !== null}
						<div>
							<dt>Auth</dt>
							<dd>
								{String((authKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const authKind = resolvedEntity.authKind}
					{#if authKind !== undefined && authKind !== null}
						<div>
							<dt>Auth</dt>
							<dd>
								{String((authKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							corsMode: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const corsMode = prefetched.corsMode}
					{#if corsMode !== undefined && corsMode !== null}
						<div>
							<dt>CORS</dt>
							<dd>
								{String((corsMode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const corsMode = resolvedEntity.corsMode}
					{#if corsMode !== undefined && corsMode !== null}
						<div>
							<dt>CORS</dt>
							<dd>
								{String((corsMode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							proxyMode: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const proxyMode = prefetched.proxyMode}
					{#if proxyMode !== undefined && proxyMode !== null}
						<div>
							<dt>Proxy</dt>
							<dd>
								{String((proxyMode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const proxyMode = resolvedEntity.proxyMode}
					{#if proxyMode !== undefined && proxyMode !== null}
						<div>
							<dt>Proxy</dt>
							<dd>
								{String((proxyMode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							environmentScope: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const environmentScope = prefetched.environmentScope}
					{#if environmentScope !== undefined && environmentScope !== null}
						<div>
							<dt>Environment</dt>
							<dd>
								{String((environmentScope) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const environmentScope = resolvedEntity.environmentScope}
					{#if environmentScope !== undefined && environmentScope !== null}
						<div>
							<dt>Environment</dt>
							<dd>
								{String((environmentScope) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadSource_TimestampsView
				selection={selection[EntityProxyField]<EntityType.BlockheadSource_Timestamp>('$$timestamps')}
				title='Observations'
				emptyText='No observations yet.'
				id='BlockheadSource_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
