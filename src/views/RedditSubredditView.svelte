<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(social)/(reddit)/reddit/r/[name]', {
			name: entityId.name,
		}),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.RedditSubreddit>
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()

	const subreddit = useEntity(
		EntityType.RedditSubreddit,
		entityId,
		{
			$: [
				Source.Reddit_Rest,
				Source.Reddit_PublicJson,
			],
			title: {},
			publicDescription: {},
			subscriberCount: {},
			activeUserCount: {},
			$$timestamps: {
				$: [
					Source.Reddit_Rest,
					Source.Reddit_PublicJson,
				],
				$limit: 1,
			},
			createdAt: {},
			over18: {},
			$icon: {},
		},
	)

	const idKey = stringify(entityId)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import RedditLinksView from '$/views/RedditLinksView.svelte'
	import RedditSubreddit_TimestampsView from '$/views/RedditSubreddit_TimestampsView.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.RedditSubreddit}
	{entityId}
	href={href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={subreddit}
			placeholderText="Loading subreddit…"
		>
			{#snippet children(subreddit)}
				{#if subreddit.$icon !== undefined}
					<IconComponent
						alt={subreddit.title ?? entityId.name}
						shape={IconShape.Circle}
						src={subreddit.$icon[EntityMetaKey.Id].url}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>
			{entityId.name}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={subreddit}
			placeholderText="Loading subreddit…"
		>
			{#snippet children(subreddit)}
				{subreddit.title ?? `r/${entityId.name}`}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Subreddits are Reddit’s named communities—their moderators and description power the posts redditSubreddits surfaced here.
		</p>
		<p>
			Profiles on other networks or realtime rooms tracked locally are unrelated redditSubreddits.
		</p>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			resource={subreddit}
			placeholderText="Loading subreddit…"
		>
			{#snippet children(subreddit)}
				{#if subreddit.publicDescription}
					<p>
						<TruncatedValue
							value={subreddit.publicDescription}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}

				<dl data-column-item="center">
					<SocialMetricSnapshotRows
						metrics={[
							{
								label: 'Subscribers',
								value: subreddit.$$timestamps[0]?.subscriberCount ?? subreddit.subscriberCount,
							},
							{
								label: 'Active users',
								value: subreddit.$$timestamps[0]?.activeUserCount ?? subreddit.activeUserCount,
							},
						]}
					/>

					{#if subreddit.createdAt != null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp
									timestamp={subreddit.createdAt}
								/>
							</dd>
						</div>
					{/if}

					{#if subreddit.over18 != null}
						<div>
							<dt>NSFW</dt>
							<dd>{subreddit.over18 ? 'Yes' : 'No'}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<CollapsibleTabs
			sectionIdPrefix={idKey}
				sections={collapsibleTabsSections([
					{ id: 'links', label: 'Submissions' },
					{ id: 'metric-snapshots', label: 'Metrics' },
				])}
			id={`${idKey}:carousel-posts`}
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
						Posts
					</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionLinks()}
				<RedditLinksView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.RedditSubreddit,
						entityId,
						fieldName: '$$links',
					}}
					id={`${idKey}:reddit-links`}
				/>
			{/snippet}

			{#snippet SectionMetricSnapshots()}
				<RedditSubreddit_TimestampsView
					entityFieldReference={{
						entityType: EntityType.RedditSubreddit,
						entityId,
						fieldName: '$$timestamps',
					}}
					href={href}
					id={`${idKey}:metric-snapshots`}
					title="Metric snapshots"
				/>
			{/snippet}
		</CollapsibleTabs>
		{/snippet}
	</EntityView>
