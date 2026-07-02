<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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

	const blockheadSource = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			label: true,
			source: true,
			provider: true,
			endpointUrl: true,
			...(open && {
				transportKind: true,
				authKind: true,
				corsMode: true,
				proxyMode: true,
				environmentScope: true,
				$$timestamps: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).label) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.id) ?? '')].filter(Boolean).join(' ') || 'source')
	const viewDomId = $derived('blockhead-source-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSource}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).label) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.id) ?? '')].filter(Boolean).join(' ') || 'source'}
		{:else}
			<ResourceBoundary resource={blockheadSource}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).label) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.id) ?? '')].filter(Boolean).join(' ') || 'source'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).label) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.id) ?? '')].filter(Boolean).join(' ') || 'source'}
		{:else}
			<ResourceBoundary resource={blockheadSource}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).source) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).label) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.id) ?? '')].filter(Boolean).join(' ') || 'source'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.source) ?? '')].filter(Boolean).join(' ') || [String((entity.label) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={blockheadSource}>
				{#snippet Pending()}
					{@const provider = prefetched.provider ?? selection.entitySelector.provider}
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
					{@const provider = entity.provider ?? selection.entitySelector.provider ?? prefetched.provider}
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

			<ResourceBoundary resource={blockheadSource}>
				{#snippet Pending()}
					{@const endpointUrl = prefetched.endpointUrl ?? selection.entitySelector.endpointUrl}
					{#if endpointUrl !== undefined && endpointUrl !== null}
						<div>
							<dt>Endpoint URL</dt>
							<dd>
								{String((endpointUrl) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const endpointUrl = entity.endpointUrl ?? selection.entitySelector.endpointUrl ?? prefetched.endpointUrl}
					{#if endpointUrl !== undefined && endpointUrl !== null}
						<div>
							<dt>Endpoint URL</dt>
							<dd>
								{String((endpointUrl) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={blockheadSource}>
				{#snippet Pending()}
					{@const transportKind = prefetched.transportKind ?? selection.entitySelector.transportKind}
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
					{@const transportKind = entity.transportKind ?? selection.entitySelector.transportKind ?? prefetched.transportKind}
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

			<ResourceBoundary resource={blockheadSource}>
				{#snippet Pending()}
					{@const authKind = prefetched.authKind ?? selection.entitySelector.authKind}
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
					{@const authKind = entity.authKind ?? selection.entitySelector.authKind ?? prefetched.authKind}
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

			<ResourceBoundary resource={blockheadSource}>
				{#snippet Pending()}
					{@const corsMode = prefetched.corsMode ?? selection.entitySelector.corsMode}
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
					{@const corsMode = entity.corsMode ?? selection.entitySelector.corsMode ?? prefetched.corsMode}
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

			<ResourceBoundary resource={blockheadSource}>
				{#snippet Pending()}
					{@const proxyMode = prefetched.proxyMode ?? selection.entitySelector.proxyMode}
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
					{@const proxyMode = entity.proxyMode ?? selection.entitySelector.proxyMode ?? prefetched.proxyMode}
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

			<ResourceBoundary resource={blockheadSource}>
				{#snippet Pending()}
					{@const environmentScope = prefetched.environmentScope ?? selection.entitySelector.environmentScope}
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
					{@const environmentScope = entity.environmentScope ?? selection.entitySelector.environmentScope ?? prefetched.environmentScope}
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
</EntityView>
