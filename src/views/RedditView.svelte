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


	// State
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
			collapsible?: boolean
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
				{#snippet children(redditNetwork)}
					{#if redditNetwork.registryLabel}
						<div>
							<dt>Registry</dt>
							<dd>{redditNetwork.registryLabel}</dd>
						</div>
					{:else if redditNetwork.protocolName}
						<div>
							<dt>Protocol</dt>
							<dd>{redditNetwork.protocolName}</dd>
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

						{#if redditNetwork.homeUrl}
							<div>
								<dt>Home</dt>
								<dd>
									<a href={redditNetwork.homeUrl}>
										{redditNetwork.homeUrl}
									</a>
								</dd>
							</div>
						{/if}

						{#if redditNetwork.docsUrl}
							<div>
								<dt>Docs</dt>
								<dd>
									<a href={redditNetwork.docsUrl}>
										{redditNetwork.docsUrl}
									</a>
								</dd>
							</div>
						{/if}

						{#if redditNetwork.topology}
							<div>
								<dt>Topology</dt>
								<dd>{redditNetwork.topology}</dd>
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
		<CollapsibleTabs
				sectionIdPrefix={networkIdKey}
				sections={[
					{ id: 'subreddits', label: 'Subreddits' },
					{ id: 'links', label: 'Popular submissions' },
				]}
				id={`${networkIdKey}:registry`}
				data-card
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

				{#snippet SectionSubreddits({ id, label })}
					<RedditSubredditsView
						CollapsibleProps={{ canToggle: false }}
						href={resolve('/reddit/subreddits')}
						entityFieldReference={{
							entityType: EntityType.RedditNetwork,
							entityId,
							fieldName: '$$redditSubreddits',
						}}
						id={`${networkIdKey}:subreddits-list`}
						open={_open}
					/>
				{/snippet}

				{#snippet SectionLinks({ id, label })}
					<RedditLinksView
						CollapsibleProps={{ canToggle: false }}
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
				{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
