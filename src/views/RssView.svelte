<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId = {
			scope: 'RssNetwork' as const,
		},
		href = resolve('/(social)/rss'),
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId?: EntityId<typeof schema, EntityType.RssNetwork>
			href?: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'

	const networkIdKey = stringify(entityId)

	const rssNetwork = useEntity(
		EntityType.RssNetwork,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			protocolName: {},
			registryLabel: {},
			...(open ?
				{
					docsUrl: {},
					homeUrl: {},
					topology: {},
					$$rssFeeds: {
						$: [
							Source.Constants_Internal,
						],
					},
					$$rssItems: {
						$: [
							Source.Rss_Rest,
							Source.Rss2Json_Rest,
						],
					},
				}
			:
				{}),
		},
	)

	const entityViewDetailCarouselScrollProps = {
		'data-row': 'start align-start',
	} as const


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import RssFeedsView from '$/views/RssFeedsView.svelte'
	import RssItemsView from '$/views/RssItemsView.svelte'
</script>


<EntityView
	entityType={EntityType.RssNetwork}
	{entityId}
	{href}
	bind:open
	{collapsible}
	{...entityViewRest}
	title="RSS / Atom"
>
	{#snippet Value()}
		{entityId.scope}

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

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<ResourceBoundary
			resource={rssNetwork}
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
						<dd>{String(rssNetwork.$rssFeeds.length)}</dd>
					</div>
					<div>
						<dt>Items</dt>
						<dd>{String(rssNetwork.$rssItems.length)}</dd>
					</div>

					{#if rssNetwork.homeUrl}
						<div>
							<dt>Home</dt>
							<dd>
							<a href={rssNetwork.homeUrl}>{rssNetwork.homeUrl}</a>
							</dd>
						</div>
					{/if}

					{#if rssNetwork.docsUrl}
						<div>
							<dt>Docs</dt>
							<dd>
							<a href={rssNetwork.docsUrl}>{rssNetwork.docsUrl}</a>
							</dd>
						</div>
					{/if}

					{#if rssNetwork.topology}
						<div>
							<dt>Topology</dt>
							<dd>{rssNetwork.topology}</dd>
						</div>
					{/if}
				{/if}
			{/snippet}
		</ResourceBoundary>
	</dl>
{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.RssNetwork}
			{entityId}
		/>

		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${networkIdKey}:carousel-registry`}
				{...{ 'data-card': '' }}
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

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Feeds"
						href={`#${networkIdKey}:feeds`}
					>Feeds</a>
					<a
						data-scroll-marker-label="Recent items"
						href={`#${networkIdKey}:items`}
					>Items</a>
				{/snippet}

				{#snippet body({ open: _sectionOpen })}
					<section data-scroll-marker-label="Feeds">
						<RssFeedsView
							entityFieldReference={{
								entityType: EntityType.RssNetwork,
								entityId,
								fieldName: '$$rssFeeds',
							}}
							href={resolve('/rss/feeds')}
							id={`${networkIdKey}:feeds`}
							open={_sectionOpen}
						/>
					</section>

					<section data-scroll-marker-label="Recent items">
						<RssItemsView
							entityFieldReference={{
								entityType: EntityType.RssNetwork,
								entityId,
								fieldName: '$$rssItems',
							}}
							href={resolve('/rss/items')}
							id={`${networkIdKey}:items`}
							limit={25}
							open={_sectionOpen}
							title="Recent items"
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>

