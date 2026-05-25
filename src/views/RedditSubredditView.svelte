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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

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
			createdAt: {},
			over18: {},
			$icon: {},
		},
	)

	const idKey = stringify(entityId)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import RedditLinksView from '$/views/RedditLinksView.svelte'
</script>


<EntityView
	entityType={EntityType.RedditSubreddit}
	{entityId}
	href={href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			{entityId.name}
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={subreddit}
			placeholderText="Loading subreddit…"
		>
			{#snippet children(loadedSubreddit)}
				{loadedSubreddit.title ?? `r/${entityId.name}`}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Icon()}
		<ResourceBoundary
			resource={subreddit}
			placeholderText="Loading subreddit…"
		>
			{#snippet children(loadedSubreddit)}
				{#if loadedSubreddit.$icon !== undefined}
					<IconComponent
						alt={loadedSubreddit.title ?? entityId.name}
						shape={IconShape.Circle}
						src={loadedSubreddit.$icon[EntityMetaKey.Id].url}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Subreddits are Reddit’s named communities—their moderators and description power the posts list surfaced here.
		</p>
		<p>
			Profiles on other networks or realtime rooms tracked locally are unrelated rows.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={subreddit}
			placeholderText="Loading subreddit…"
		>
			{#snippet children(loadedSubreddit)}
				<dl data-column-item="center">
					{#if loadedSubreddit.publicDescription}
						<div>
							<dt>Description</dt>
							<dd>{loadedSubreddit.publicDescription}</dd>
						</div>
					{/if}

					{#if loadedSubreddit.subscriberCount != null}
						<div>
							<dt>Subscribers</dt>
							<dd>
								<NumberValue
									value={loadedSubreddit.subscriberCount}
								/>
							</dd>
						</div>
					{/if}

					{#if loadedSubreddit.activeUserCount != null}
						<div>
							<dt>Active users</dt>
							<dd>
								<NumberValue
									value={loadedSubreddit.activeUserCount}
								/>
							</dd>
						</div>
					{/if}

					{#if loadedSubreddit.createdAt != null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp
									timestamp={loadedSubreddit.createdAt}
								/>
							</dd>
						</div>
					{/if}

					{#if loadedSubreddit.over18 != null}
						<div>
							<dt>NSFW</dt>
							<dd>{loadedSubreddit.over18 ? 'Yes' : 'No'}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.RedditSubreddit}
			{entityId}
		/>
		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				sectionIdPrefix={idKey}
				sections={[
					{ id: 'links', label: 'Submissions' },
				]}
				id={`${idKey}:carousel-posts`}
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
							Posts
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionLinks({ id, label })}
					<RedditLinksView
						href={resolve('/reddit/links')}
						entityFieldReference={{
							entityType: EntityType.RedditSubreddit,
							entityId,
							fieldName: '$$links',
						}}
						id={`${idKey}:reddit-links`}
					/>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>

