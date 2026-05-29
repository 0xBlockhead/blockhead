<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId = {
			scope: 'RssNetwork' as const,
		},
		href = resolve('/rss'),
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId?: EntityId<typeof schema, EntityType.RssNetwork>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		never
	> = $props()


	// State
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
	href={href}
	bind:open
	{collapsible}
	{...EntityViewProps}
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
							<dd>{String(rssNetwork.$$rssFeeds.length)}</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Items</dt>
							<dd>{String(rssNetwork.$$rssItems.length)}</dd>
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
				id={`${networkIdKey}:carousel-registry`}
				sectionIdPrefix={networkIdKey}
				sections={[
					{ id: 'feeds', label: 'Feeds' },
					{ id: 'items', label: 'Recent items' },
				]}
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
							entityId,
							fieldName: '$$rssFeeds',
						}}
						id={`${networkIdKey}:feeds`}
						open={_open}
					/>
				{/snippet}

				{#snippet SectionItems({ id, label })}
					<RssItemsView
						CollapsibleProps={{ canToggle: false }}
						href={resolve('/rss/items')}
						entityFieldReference={{
							entityType: EntityType.RssNetwork,
							entityId,
							fieldName: '$$rssItems',
						}}
						id={`${networkIdKey}:items`}
						limit={25}
						open={_open}
						title="Recent items"
					/>
				{/snippet}
		</CollapsibleTabs>

	{/snippet}
</EntityView>
