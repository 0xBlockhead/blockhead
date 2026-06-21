<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/rss'),
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.RssNetwork>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		never
	> = $props()

	const networkSelectorKey = $derived(
		stringify(selection.entitySelector),
	)

	const entityViewDetailCarouselScrollProps = {
		'data-row': 'start align-start',
	}


	// Components
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import RssFeedsView from '$/views/RssFeedsView.svelte'
</script>


<EntityView
	entityType={EntityType.RssNetwork}
	entitySelector={selection.entitySelector}
	href={href}
	bind:open
	{collapsible}
	{...EntityViewProps}
	title="RSS / Atom"
>
	{#snippet Value()}
		{selection.entitySelector.scope}

	{/snippet}

	{#snippet Title()}
		RSS / Atom
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			RSS 2.0 and Atom syndication feeds publish ordered item streams keyed by feedUrl.
		</p>
		<p>
			Seed feeds come from Constants; live items resolve via direct XML fetch (Rss_Rest) or the rss2json API (Rss2Json) when enabled.
		</p>
		<p>
			Not chat threads, on-chain events, or social graphs from other protocols.
		</p>
	{/snippet}

	{#snippet Content({})}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection(({ sources: [
							Source.Constants_Internal,
						], fields: { protocolName: true, registryLabel: true, ...(open ? ({ docsUrl: true, homeUrl: true, topology: true, $$rssFeeds: ({ sources: [
									Source.Constants_Internal,
								] }) }) : ({  })) } }))}
				placeholderText="Loading RSS hub directory…"
			>
				{#snippet children(rssNetwork)}
					{#if rssNetwork.registryLabel}
						<div>
							<dt>Registry</dt>
							<dd>{rssNetwork.registryLabel}</dd>
						</div>
					{:else if rssNetwork.protocolName}
						<div>
							<dt>Protocol</dt>
							<dd>{rssNetwork.protocolName}</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Feeds</dt>
							<dd>{String(rssNetwork.$$rssFeeds?.values.length ?? 0)}</dd>
						</div>
					{/if}

					{#if open && rssNetwork.homeUrl}
						<div>
							<dt>Home</dt>
							<dd>
								<a href={rssNetwork.homeUrl}>{rssNetwork.homeUrl}</a>
							</dd>
						</div>
					{/if}

					{#if open && rssNetwork.docsUrl}
						<div>
							<dt>Docs</dt>
							<dd>
								<a href={rssNetwork.docsUrl}>{rssNetwork.docsUrl}</a>
							</dd>
						</div>
					{/if}

					{#if open && rssNetwork.topology}
						<div>
							<dt>Topology</dt>
							<dd>{rssNetwork.topology}</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<CollapsibleTabs
			id={`${networkSelectorKey}:carousel-registry`}
			sectionIdPrefix={networkSelectorKey}
			sections={collapsibleTabsSections([
				{ id: 'feeds', label: 'Feeds' },
			])}
			data-card
			scrollContainerProps={entityViewDetailCarouselScrollProps}
		>
			{#snippet Summary({ open: _summaryOpen })}
				<header
					data-row-item="flexible"
					data-row="wrap gap-4"
				>
					<HeadingComponent>
						Feed registry
					</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionFeeds({ id, label })}
				<RssFeedsView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/rss/feeds')}
					selection={selection.$$rssFeeds}
					id={`${networkSelectorKey}:feeds`}
					open={_open}
				/>
			{/snippet}
		</CollapsibleTabs>

	{/snippet}
</EntityView>
