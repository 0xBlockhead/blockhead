<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(social)/(atproto)/atproto/post/[uri]', {
			uri: encodeURIComponent(entityId.uri),
		}),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.AtprotoPost>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const idKey = stringify(entityId)

	const post = useEntity(
		EntityType.AtprotoPost,
		entityId,
		{
			$: [
				Source.Atproto_Xrpc,
				Source.Atproto_BskySocial_Xrpc,
			],
			text: {},
			createdAt: {},
			...(open ?
				{
					$author: {},
					$parent: {},
					$root: {},
					indexedAt: {},
					replyCount: {},
					repostCount: {},
					likeCount: {},
					quoteCount: {},
					langs: {},
					selfLabelValues: {},
				}
			:
				{}),
		},
	)


	// Components
	import AtprotoActorView from '$/views/AtprotoActorView.svelte'
	import AtprotoPostThreadView from '$/views/AtprotoPostThreadView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.AtprotoPost}
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Bluesky posts are AT Protocol repository records keyed by at-URI; text, reply parent/root, and engagement counts come from the public App View API.
		</p>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue
			endLength={12}
			format={TruncatedValueFormat.Visual}
			startLength={20}
			value={entityId.uri}
		/>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={post}
			placeholderText="Loading post…"
		>
			{#snippet children(post)}
				{#if post.text}
					<TruncatedValue
						endLength={8}
						format={TruncatedValueFormat.Visual}
						startLength={88}
						value={post.text}
					/>
				{:else}
					{@render Value()}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={post}
		>
			{#snippet children(post)}
				{#if post.createdAt}
					<span data-text="muted">
						<Timestamp
							timestamp={post.createdAt}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<ResourceBoundary
			resource={post}
			placeholderText="Loading post…"
		>
			{#snippet children(post)}
				<dl data-column-item="center">
					{#if post.text}
						<div>
							<dt>Text</dt>
							<dd>{post.text}</dd>
						</div>
					{/if}

					{#if post.createdAt}
						<div>
							<dt>Published</dt>
							<dd>
								<Timestamp
									timestamp={post.createdAt}
								/>
							</dd>
						</div>
					{/if}

					{#if contentOpen && post.$author}
						<div>
							<dt>Author</dt>
							<dd>
								<AtprotoActorView
									entityId={post.$author[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if contentOpen && post.$parent}
						<div>
							<dt>Reply to</dt>
							<dd>
								<AtprotoPostView
									entityId={post.$parent[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if contentOpen && post.$root && post.$root[EntityMetaKey.Id].uri !== post.$parent?.[EntityMetaKey.Id].uri}
						<div>
							<dt>Thread root</dt>
							<dd>
								<AtprotoPostView
									entityId={post.$root[EntityMetaKey.Id]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if contentOpen && post.replyCount != null}
						<div>
							<dt>Replies</dt>
							<dd>
								<NumberValue
									value={post.replyCount}
								/>
							</dd>
						</div>
					{/if}

					{#if contentOpen && post.repostCount != null}
						<div>
							<dt>Reposts</dt>
							<dd>
								<NumberValue
									value={post.repostCount}
								/>
							</dd>
						</div>
					{/if}

					{#if contentOpen && post.likeCount != null}
						<div>
							<dt>Likes</dt>
							<dd>
								<NumberValue
									value={post.likeCount}
								/>
							</dd>
						</div>
					{/if}

					{#if contentOpen && post.quoteCount != null}
						<div>
							<dt>Quotes</dt>
							<dd>
								<NumberValue
									value={post.quoteCount}
								/>
							</dd>
						</div>
					{/if}

					{#if contentOpen && post.langs?.length}
						<div>
							<dt>Languages</dt>
							<dd>{post.langs.join(', ')}</dd>
						</div>
					{/if}

					{#if contentOpen && post.selfLabelValues?.length}
						<div>
							<dt>Self labels</dt>
							<dd>{post.selfLabelValues.join(', ')}</dd>
						</div>
					{/if}

					{#if contentOpen && post.indexedAt}
						<div>
							<dt>Indexed</dt>
							<dd>
								<Timestamp
									timestamp={post.indexedAt}
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
		<CollapsibleTabs
				id={`${idKey}:carousel-post`}
				sectionIdPrefix={idKey}
				sections={[
					{ id: 'thread', label: 'Thread' },
					{ id: 'repository', label: 'Repository' },
				]}
				data-card
			>
				{#snippet Summary({ open: _postSummaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Thread & repository
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionThread({ id: _id, label: _label })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Thread
						</HeadingComponent>
					</header>

					<AtprotoPostThreadView
						entityFieldReference={{
							entityType: EntityType.AtprotoPost,
							entityId,
							fieldName: '$$thread',
						}}
						id={`${idKey}:thread-list`}
						open={true}
						title="Thread"
					/>
				{/snippet}

				{#snippet SectionRepository({ id: _id, label: _label })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Repository
						</HeadingComponent>
					</header>

				{/snippet}
		</CollapsibleTabs>
	{/snippet}
</EntityView>
