<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'

	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	const entityId = {
		scope: 'RedditNetwork' as const,
	}


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const networkIdKey = stringify(entityId)

	let open = $state(true)

	const redditNetwork = useEntity(
		EntityType.RedditNetwork,
		entityId,
		{
			$: [
				Source.Constants_Internal,
			],
			docsUrl: {},
			homeUrl: {},
			protocolName: {},
			$$redditLinks: {
				$: [
					Source.Reddit_Rest,
				],
			},
			$$redditSubreddits: {
				$: [
					Source.Reddit_Rest,
				],
			},
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import RedditLinksView from '$/views/RedditLinksView.svelte'
	import RedditSubredditsView from '$/views/RedditSubredditsView.svelte'
</script>


<EntityView
	entityType={EntityType.RedditNetwork}
	{entityId}
	href={resolve('/(social)/reddit')}
	layout={EntityLayout.SummaryDetails}
	bind:open
	title="Reddit"
>
	{#snippet Heading()}
		<span data-text="font-monospace">
			{entityId.scope}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Reddit’s HTTP APIs return communities, ranked submissions, and linked comment threads under a common JSON model.
		</p>
		<p>
			Reddit’s public API surfaces subreddits, submissions, and comment trees over HTTPS—separate transport from low-latency game/voice rooms or Nostr/Farcaster relays.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={redditNetwork}
			placeholderText="Loading Reddit…"
		>
			{#snippet children(u)}
				<dl data-column-item="center">
					<div>
						<dt>Scope</dt>
						<dd>{entityId.scope}</dd>
					</div>
					<div>
						<dt>Communities</dt>
						<dd>{String(u.$$redditSubreddits.length)}</dd>
					</div>
					<div>
						<dt>Submissions</dt>
						<dd>{String(u.$$redditLinks.length)}</dd>
					</div>
					{#if open}
						<div>
							<dt>Protocol name</dt>
							<dd>{String(u.protocolName ?? 'Reddit')}</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Home</dt>
							<dd>
								<a href={String(u.homeUrl ?? '#')}>
									{String(u.homeUrl ?? '—')}
								</a>
							</dd>
						</div>
					{/if}

					{#if open}
						{#if u.docsUrl != null && u.docsUrl !== ''}
							<div>
								<dt>Docs</dt>
								<dd>
									<a href={u.docsUrl}>
										{u.docsUrl}
									</a>
								</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.RedditNetwork}
			{entityId}
		/>

		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${networkIdKey}:registry`}
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
							Popular index
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({
					open: _markersOpen,
				})}
					<a
						data-scroll-marker-label="Subreddits"
						href={`#${networkIdKey}:subreddits`}
					>Subreddits</a>
					<a
						data-scroll-marker-label="Popular submissions"
						href={`#${networkIdKey}:links`}
					>Submissions</a>
				{/snippet}

				{#snippet children({
					open: _sectionOpen,
				})}
					<section
						id={`${networkIdKey}:subreddits`}
						data-scroll-marker-label="Subreddits"
					>
						<RedditSubredditsView
							entityFieldReference={{
								entityType: EntityType.RedditNetwork,
								entityId,
								fieldName: '$$redditSubreddits',
							}}
							href={resolve('/(social)/reddit')}
							id={`${networkIdKey}:subreddits-list`}
							open={false}
						/>
					</section>

					<section
						id={`${networkIdKey}:links`}
						data-scroll-marker-label="Popular submissions"
					>
						<RedditLinksView
							entityFieldReference={{
								entityType: EntityType.RedditNetwork,
								entityId,
								fieldName: '$$redditLinks',
							}}
							href={resolve('/(social)/reddit')}
							id={`${networkIdKey}:links-list`}
							open={false}
							title="Popular submissions"
						/>
					</section>
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
