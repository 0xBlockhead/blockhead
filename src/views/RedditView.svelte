<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href = resolve(
			'/reddit',
			entityId,
		),
					open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.RedditNetwork>
			href?: string
			open?: boolean
		},
		never
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const networkIdKey = stringify(entityId)

	const redditNetwork = useEntity(
		EntityType.RedditNetwork,
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
					$$redditLinks: {
						$: [
							Source.Reddit_Rest,
							Source.Reddit_PublicJson,
						],
					},
					$$redditSubreddits: {
						$: [
							Source.Reddit_Rest,
							Source.Reddit_PublicJson,
						],
					},
				}
			:
				{}),
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import RedditLinksView from '$/views/RedditLinksView.svelte'
	import RedditSubredditsView from '$/views/RedditSubredditsView.svelte'
</script>


<EntityView
	entityType={EntityType.RedditNetwork}
	{entityId}
	href={href}
	layout={EntityLayout.SummaryDetails}
	bind:open
	{collapsible}
	{...EntityViewProps}
	title="Reddit"
>
	{#snippet Value()}
		{entityId.scope}

	{/snippet}

	{#snippet Title()}
		Reddit
	{/snippet}

	{#snippet Heading()}
		{@render Title()}
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
		<dl data-column-item="center">
			<ResourceBoundary
				resource={redditNetwork}
				placeholderText="Loading Reddit…"
			>
				{#snippet children(loadedRedditNetwork)}
					{#if loadedRedditNetwork.registryLabel}
						<div>
							<dt>Registry</dt>
							<dd>{loadedRedditNetwork.registryLabel}</dd>
						</div>
					{:else if loadedRedditNetwork.protocolName}
						<div>
							<dt>Protocol</dt>
							<dd>{loadedRedditNetwork.protocolName}</dd>
						</div>
					{/if}

					{#if open}
						<div>
							<dt>Communities</dt>
							<dd>{String(redditNetwork.$$redditSubreddits?.length ?? 0)}</dd>
						</div>
						<div>
							<dt>Submissions</dt>
							<dd>{String(redditNetwork.$$redditLinks?.length ?? 0)}</dd>
						</div>

						{#if loadedRedditNetwork.homeUrl}
							<div>
								<dt>Home</dt>
								<dd>
									<a href={loadedRedditNetwork.homeUrl}>
										{loadedRedditNetwork.homeUrl}
									</a>
								</dd>
							</div>
						{/if}

						{#if loadedRedditNetwork.docsUrl}
							<div>
								<dt>Docs</dt>
								<dd>
									<a href={loadedRedditNetwork.docsUrl}>
										{loadedRedditNetwork.docsUrl}
									</a>
								</dd>
							</div>
						{/if}

						{#if loadedRedditNetwork.topology}
							<div>
								<dt>Topology</dt>
								<dd>{loadedRedditNetwork.topology}</dd>
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

				{#snippet body({ open: _sectionOpen,
				})}
					<section
						id={`${networkIdKey}:subreddits`}
						data-scroll-marker-label="Subreddits"
					>
						<RedditSubredditsView
							href={resolve('/reddit/subreddits')}
							entityFieldReference={{
								entityType: EntityType.RedditNetwork,
								entityId,
								fieldName: '$$redditSubreddits',
							}}
							id={`${networkIdKey}:subreddits-list`}
							open={_open}
						/>
					</section>

					<section
						id={`${networkIdKey}:links`}
						data-scroll-marker-label="Popular submissions"
					>
						<RedditLinksView
							href={resolve('/reddit/links')}
							entityFieldReference={{
								entityType: EntityType.RedditNetwork,
								entityId,
								fieldName: '$$redditLinks',
							}}
							id={`${networkIdKey}:links-list`}
							open={_open}
							title="Popular submissions"
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>

