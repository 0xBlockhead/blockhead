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
			selection: EntityProxyResource<typeof schema, EntityType.RssNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.RssNetwork>>
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

	const rssNetwork = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			protocolName: true,
			homeUrl: true,
			docsUrl: true,
			registryLabel: true,
			topology: true,
			...(open && {
				$$rssFeeds: true,
				$$sourceWindowItems: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).protocolName) ?? '')].filter(Boolean).join(' ') || 'RSS / Atom')
	const viewDomId = $derived('rss-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.RssNetwork}
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
			{[String((({ ...selection.entitySelector, ...prefetched }).protocolName) ?? '')].filter(Boolean).join(' ') || title || 'RSS / Atom'}
		{:else}
			<ResourceBoundary resource={rssNetwork}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).protocolName) ?? '')].filter(Boolean).join(' ') || title || 'RSS / Atom'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.protocolName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).protocolName) ?? '')].filter(Boolean).join(' ') || title || 'RSS / Atom'}
		{:else}
			<ResourceBoundary resource={rssNetwork}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).protocolName) ?? '')].filter(Boolean).join(' ') || title || 'RSS / Atom'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.protocolName) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			RSS and Atom syndication feeds publish ordered item streams keyed by feed URL.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Home URL</dt>
				<dd>
					<ResourceBoundary resource={rssNetwork}>
						{#snippet Pending()}
							{@const homeUrl = prefetched.homeUrl ?? selection.entitySelector.homeUrl}
							{#if homeUrl !== undefined && homeUrl !== null}
								<svelte:element
									this={'a'}
									href={String(homeUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(homeUrl)} />
								</svelte:element>
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const homeUrl = entity.homeUrl ?? selection.entitySelector.homeUrl ?? prefetched.homeUrl}
							{#if homeUrl !== undefined && homeUrl !== null}
								<svelte:element
									this={'a'}
									href={String(homeUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(homeUrl)} />
								</svelte:element>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={rssNetwork}>
				{#snippet Pending()}
					{@const docsUrl = prefetched.docsUrl ?? selection.entitySelector.docsUrl}
					{#if docsUrl !== undefined && docsUrl !== null}
						<div>
							<dt>Docs URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(docsUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(docsUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const docsUrl = entity.docsUrl ?? selection.entitySelector.docsUrl ?? prefetched.docsUrl}
					{#if docsUrl !== undefined && docsUrl !== null}
						<div>
							<dt>Docs URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(docsUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(docsUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={rssNetwork}>
				{#snippet Pending()}
					{@const registryLabel = prefetched.registryLabel ?? selection.entitySelector.registryLabel}
					{#if registryLabel !== undefined && registryLabel !== null}
						<div>
							<dt>Registry</dt>
							<dd>
								{String((registryLabel) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const registryLabel = entity.registryLabel ?? selection.entitySelector.registryLabel ?? prefetched.registryLabel}
					{#if registryLabel !== undefined && registryLabel !== null}
						<div>
							<dt>Registry</dt>
							<dd>
								{String((registryLabel) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={rssNetwork}>
				{#snippet Pending()}
					{@const topology = prefetched.topology ?? selection.entitySelector.topology}
					{#if topology !== undefined && topology !== null}
						<div>
							<dt>Topology</dt>
							<dd>
								{String((topology) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const topology = entity.topology ?? selection.entitySelector.topology ?? prefetched.topology}
					{#if topology !== undefined && topology !== null}
						<div>
							<dt>Topology</dt>
							<dd>
								{String((topology) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
