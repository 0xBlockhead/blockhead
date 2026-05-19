<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { entityResolversByEntityType } from '$/resolvers/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.XPost>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'Content'
			| 'Details'
			| 'entityId'
			| 'entityType'
			| 'Heading'
			| 'Icon'
			| 'href'
			| 'open'
			| 'title'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const post = useEntity(
		EntityType.XPost,
		entityId,
		{
			$: (
				entityResolversByEntityType[EntityType.XPost]?.map((r) => r.source)
				?? [Source.Local_Internal]
			),
			text: {},
			createdAt: {},
			$author: {},
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import XUserView from '$/views/XUserView.svelte'
</script>


<EntityView
	entityType={EntityType.XPost}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={post}
			placeholderText="Loading X post…"
		>
			{#snippet children(resolvedXPost)}
				{#if resolvedXPost.text}
					<TruncatedValue
						endLength={8}
						format={TruncatedValueFormat.Visual}
						startLength={88}
						value={resolvedXPost.text}
					/>
				{:else}
					{entityId.id}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
<p>
					Public posts on X (Twitter): short text, timestamps, and author profile links.
				</p>
				<p>
					Not Reddit threads, storage CIDs, on-chain receipts, or encrypted chats.
				</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href, open: contentOpen })}
		<ResourceBoundary
			resource={post}
			placeholderText="Loading X post…"
		>
			{#snippet children(resolvedXPost)}
				{#if resolvedXPost.text}
					{#if !contentOpen}
						<p>
							{resolvedXPost.text}
						</p>
					{/if}
				{/if}

				{#if resolvedXPost.$author}
					<p data-text="muted">
						<a
							href={resolve(
								'/(social)/x/user/[userId]',
								{
									userId: encodeURIComponent(
										resolvedXPost.$author[EntityMetaKey.Id].id,
									),
								},
							)}
						>Profile (id {resolvedXPost.$author[EntityMetaKey.Id].id})</a>
					</p>
				{/if}
				<dl data-column-item="center">
					{#if resolvedXPost.text}
						<div>
							<dt>Post id</dt>
							<dd data-text="mono">
								{@render Id()}
							</dd>
						</div>
					{/if}

					{#if contentOpen}
						{#if resolvedXPost.text}
							<div>
								<dt>Text</dt>
								<dd>{resolvedXPost.text}</dd>
							</div>
						{/if}

						{#if resolvedXPost.createdAt != null}
							<div>
								<dt>Created at</dt>
								<dd>
									<Timestamp
										timestamp={resolvedXPost.createdAt}
										format={TimestampFormat.Both}
									/>
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
		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`x-post:${entityId.id}:carousel`}
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
							Post details
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({
					open: _markersOpen,
				})}
					<a
						data-scroll-marker-label="Author"
						href={`#x-post:${entityId.id}:author`}
					>Author</a>
					<a
						data-scroll-marker-label="Post"
						href={`#x-post:${entityId.id}:post`}
					>Post</a>
				{/snippet}

				{#snippet children({
					open: _paneOpen,
				})}
					<section
						data-scroll-marker-label="Author"
						id={`x-post:${entityId.id}:author`}
					>
						<ResourceBoundary
							resource={post}
							placeholderText="Loading X post…"
						>
							{#snippet children(resolvedXPost)}
								{#if resolvedXPost.$author}
									<XUserView
										entityId={resolvedXPost.$author[EntityMetaKey.Id]}
										href={resolve(
											'/(social)/x/user/[userId]',
											{
												userId: encodeURIComponent(
													resolvedXPost.$author[EntityMetaKey.Id].id,
												),
											},
										)}
										layout={EntityLayout.Summary}
										open={false}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</section>
					<section
						data-scroll-marker-label="Post"
						id={`x-post:${entityId.id}:post`}
					>
						<ResourceBoundary
							resource={post}
							placeholderText="Loading X post…"
						>
							{#snippet children(resolvedXPost)}
								<dl data-column-item="center">
									{#if resolvedXPost.text}
										<div>
											<dt>Text</dt>
											<dd>{resolvedXPost.text}</dd>
										</div>
									{/if}

									{#if resolvedXPost.createdAt != null}
										<div>
											<dt>Created at</dt>
											<dd>
												<Timestamp
													timestamp={resolvedXPost.createdAt}
													format={TimestampFormat.Both}
												/>
											</dd>
										</div>
									{/if}
								</dl>
							{/snippet}
						</ResourceBoundary>
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
