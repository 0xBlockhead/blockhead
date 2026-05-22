<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Props
	let {
		children,
		entityId,
		href,
		limit = 50,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.FarcasterFeed>
			href: string
			limit?: number
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
			| 'Icon'
			| 'Heading'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { mountEntityResolveLive } from '$/lib/db/resolveLive.svelte.ts'

	mountEntityResolveLive({
		entityType: EntityType.FarcasterFeed,
		entityId: () => entityId,
	})

	const feed = useEntity(
		EntityType.FarcasterFeed,
		entityId,
		{
			$: [
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
				Source.Farcaster_Rest,
			],
			label: {},
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import FarcasterCastsView from '$/views/FarcasterCastsView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterFeed}
	{entityId}
	{href}
	bind:open
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet Title()}
		<span>
			{entityId.feedId}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={feed}
			placeholderText="Loading Farcaster feed (variant, FID or channel id, cast stream)…"
		>
			{#snippet children(feed)}
				{(
					feed.label != null
					&& feed.label !== ''
				) ?
					feed.label
				: entityId.variant === 'trending' ?
					'Trending'
				: entityId.variant === 'byUser' ?
					`FID ${String(entityId.fid)}`
				: entityId.variant === 'byChannel' ?
					entityId.channelId
				:
					'Following'
				}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl>
			<div>
				<dt>Variant</dt>
				<dd>{entityId.variant}</dd>
			</div>
			{#if entityId.variant === 'following'}
				<div>
					<dt>Viewer FID</dt>
					<dd>{String(entityId.viewerFid)}</dd>
				</div>
			{/if}

			<div>
				<dt>Label</dt>
				<dd>
					<ResourceBoundary
						resource={feed}
						placeholderText="Loading Farcaster feed (variant, FID or channel id, cast stream)…"
					>
						{#snippet children(feed)}
							{#if feed.label != null && feed.label !== ''}
								{feed.label}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{@const feedDetailKey = stringify(entityId)}
		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${feedDetailKey}:carousel-feed`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({
					open: _summaryOpen,
				})}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Feed
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({
					open: _markersOpen,
				})}
					<a
						data-scroll-marker-label="Record"
						href={`#${feedDetailKey}:feed-record`}
					>Record</a>
					<a
						data-scroll-marker-label="Casts"
						href={`#${feedDetailKey}:feed-entries`}
					>Casts</a>
					{#if children}
						<a
							data-scroll-marker-label="More"
							href={`#${feedDetailKey}:feed-more`}
						>More</a>
					{/if}
				{/snippet}

				{#snippet body({ open: _paneOpen,
				})}
					<section
						data-scroll-marker-label="Record"
						id={`${feedDetailKey}:feed-record`}
					>
						<EntityDetails
							entityType={EntityType.FarcasterFeed}
							{entityId}
						/>
					</section>
					<section
						data-scroll-marker-label="Casts"
						id={`${feedDetailKey}:feed-entries`}
					>
						<FarcasterCastsView
							entityFieldReference={{
								entityType: EntityType.FarcasterFeed,
								entityId,
								fieldName: '$$entries',
							}}
							href={href}
							id={`${feedDetailKey}:entries`}
							{limit}
							title="Feed"
						/>
					</section>
					{#if children}
						<section
							data-scroll-marker-label="More"
							id={`${feedDetailKey}:feed-more`}
						>
							{@render children()}
						</section>
					{/if}
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>


<style>
	.entity-view-detail-carousels :global(.collapsible-tabs-scroll[data-scroll-container]) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 36ch;
			}
		}
	}
</style>
