<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(social)/(reddit)/reddit/comment/[fullname]', {
			fullname: entityId.fullname,
		}),
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.RedditComment>
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

	const comment = useEntity(
		EntityType.RedditComment,
		entityId,
		{
			$: [
				Source.Reddit_Rest,
				Source.Reddit_PublicJson,
			],
			body: {},
			author: {},
			score: {},
			createdAt: {},
			depth: {},
			$link: {},
			$parentComment: {},
		},
	)

	const idKey = stringify(entityId)


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import Markdown from '$/components/Markdown.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import RedditCommentsView from '$/views/RedditCommentsView.svelte'
	import RedditLinkView from '$/views/RedditLinkView.svelte'
</script>


<EntityView
	entityType={EntityType.RedditComment}
	{entityId}
	href={href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span data-text="font-monospace">
			{entityId.fullname}
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={comment}
			placeholderText="Loading Reddit comment…"
		>
			{#snippet children(comment)}
				{(
					comment.body ?
						comment.body
					:
						entityId.fullname
				)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={comment}
		>
			{#snippet children(comment)}
				{#if comment.createdAt != null}
					<span data-text="muted">
						<Timestamp
							timestamp={comment.createdAt}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Reddit organizes posts with nested threaded replies anchored on a submission.
		</p>
		<p>
			It is unrelated to realtime collaboration rooms here or casts on other networks.
		</p>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<ResourceBoundary
			resource={comment}
			placeholderText="Loading Reddit comment…"
		>
			{#snippet children(comment)}
				<dl data-column-item="center">
					<div>
						<dt>Body</dt>
						<dd>
							{#if !comment.body}
								<p data-text="muted">No comment text.</p>
							{:else}
								<Markdown content={comment.body} />
							{/if}
						</dd>
					</div>

					{#if comment.score != null}
						<div>
							<dt>Score</dt>
							<dd>
								<NumberValue
									value={comment.score}
								/>
							</dd>
						</div>
					{/if}

					{#if comment.depth != null}
						<div>
							<dt>Depth</dt>
							<dd>
								<NumberValue
									value={comment.depth}
								/>
							</dd>
						</div>
					{/if}

					<div>
						<dt>Author</dt>
						<dd>
							{#if comment.author}
								u/{comment.author}
							{:else}
								<span data-text="muted">[deleted]</span>
							{/if}
						</dd>
					</div>

					<div>
						<dt>Reply to</dt>
						<dd>
							{#if comment.$parentComment}
								<RedditCommentView
									entityId={comment.$parentComment[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							{:else}
								<span data-text="muted">Top-level reply to submission</span>
							{/if}
						</dd>
					</div>

					{#if comment.$link}
						<div>
							<dt>Submission</dt>
							<dd>
								<RedditLinkView
									entityId={comment.$link[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				sectionIdPrefix={idKey}
				sections={[
					{ id: 'comment-details', label: 'Metadata' },
					{ id: 'comment-replies', label: 'Replies' },
				]}
				id={`${idKey}:carousel-comment`}
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
							Comment & replies
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionCommentDetails({ id, label })}
					<EntityDetails
						entityType={EntityType.RedditComment}
						{entityId}
					/>
				{/snippet}

				{#snippet SectionCommentReplies({ id, label })}
					<RedditCommentsView
						href={resolve('/reddit/comments')}
						entityFieldReference={{
							entityType: EntityType.RedditComment,
							entityId,
							fieldName: '$$replies',
						}}
						id={`${idKey}:reddit-replies`}
						sortMode="createdAtAsc"
						title="Replies"
					/>
				{/snippet}
			</CollapsibleTabs>
		</div>

	{/snippet}
</EntityView>

