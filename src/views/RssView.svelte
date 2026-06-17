<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		selector = {
			scope: 'RssNetwork',
		},
		href = resolve('/rss'),
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector?: EntitySelector<typeof schema, EntityType.RssNetwork>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		never
	> = $props()

	const networkSelectorKey = stringify(selector)

	

	const entityViewDetailCarouselScrollProps = {
		'data-row': 'start align-start',
	}


	// Components
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import RssFeedsView from '$/views/RssFeedsView.svelte'
	import RssItemsView from '$/views/RssItemsView.svelte'
</script>


<EntityView
	entityType={EntityType.RssNetwork}
	entitySelector={selector}
	href={href}
	bind:open
	{collapsible}
	{...EntityViewProps}
	title="RSS / Atom"
>
	{#snippet Value()}
		{selector.scope}

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
				resource={proxy(EntityType.RssNetwork, selector, ({ sources: [
						Source.Constants_Internal,
					], fields: { protocolName: true, registryLabel: true, ...(open ? ({ docsUrl: true, homeUrl: true, topology: true, $$rssFeeds: ({ sources: [
									Source.Constants_Internal,
								] }), $$rssItems: ({ sources: [
									Source.Rss_Rest,
									Source.Rss2Json_Rest,
								] }) }) : ({  })) } }))}
				placeholderText="Loading RSS hub directory…"
			>
				{#snippet children(rssNetwork)}
					{#if rssNetwork.fields.registryLabel}
						<div>
							<dt>Registry</dt>
							<dd>{rssNetwork.fields.registryLabel}</dd>
						</div>
					{:else if rssNetwork.fields.protocolName}
						<div>
							<dt>Protocol</dt>
							<dd>{rssNetwork.fields.protocolName}</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Feeds</dt>
							<dd>{String(rssNetwork.fields.$$rssFeeds?.values.length)}</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Items</dt>
							<dd>{String(rssNetwork.fields.$$rssItems?.values.length)}</dd>
						</div>
					{/if}

					{#if open && rssNetwork.fields.homeUrl}
						<div>
							<dt>Home</dt>
							<dd>
								<a href={rssNetwork.fields.homeUrl}>{rssNetwork.fields.homeUrl}</a>
							</dd>
						</div>
					{/if}

					{#if open && rssNetwork.fields.docsUrl}
						<div>
							<dt>Docs</dt>
							<dd>
								<a href={rssNetwork.fields.docsUrl}>{rssNetwork.fields.docsUrl}</a>
							</dd>
						</div>
					{/if}

					{#if open && rssNetwork.fields.topology}
						<div>
							<dt>Topology</dt>
							<dd>{rssNetwork.fields.topology}</dd>
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
				{ id: 'items', label: 'Recent items' },
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
					entityFieldReference={{
						entityType: EntityType.RssNetwork,
						selector,
						fieldName: '$$rssFeeds',
					}}
					id={`${networkSelectorKey}:feeds`}
					open={_open}
				/>
			{/snippet}

			{#snippet SectionItems({ id, label })}
				<RssItemsView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/rss/items')}
					entityFieldReference={{
						entityType: EntityType.RssNetwork,
						selector,
						fieldName: '$$rssItems',
					}}
					id={`${networkSelectorKey}:items`}
					limit={25}
					open={_open}
					title="Recent items"
				/>
			{/snippet}
		</CollapsibleTabs>

	{/snippet}
</EntityView>
