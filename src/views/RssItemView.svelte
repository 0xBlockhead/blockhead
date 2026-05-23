<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href,
		layout,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.RssItem>
			href: string
			layout?: EntityLayout
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'layout'
			| 'title'
			| 'Details'
			| 'Icon'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const item = useEntity(
		EntityType.RssItem,
		entityId,
		{
			$: [
				Source.Rss_Rest,
				Source.Rss2Json_Rest,
			],
			title: {},
			$feed: {},
			...(open ?
				{
					link: {},
					description: {},
					content: {},
					author: {},
					publishedAt: {},
				}
			:
				{}),
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import RssFeedView from '$/views/RssFeedView.svelte'
</script>


<EntityView
	entityType={EntityType.RssItem}
	{entityId}
	{href}
	{layout}
	bind:open
	{...entityViewRest}
>
	{#snippet Value()}
		<TruncatedValue
			value={entityId.guid}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={item}
			placeholderText="Loading item…"
		>
			{#snippet children(item)}
				{#if item.title}
					{item.title}
				{:else}
					<TruncatedValue
						value={entityId.guid}
						format={TruncatedValueFormat.Visual}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A syndicated RSS / Atom entry keyed by feedUrl + guid within its source feed.
		</p>
		<p>
			description is the summary; content is the full encoded body when the feed provides it. publishedAt is the syndication date.
		</p>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={item}
			placeholderText=""
		>
			{#snippet children(item)}
				{#if item.publishedAt != null}
					<span data-text="muted">
						<Timestamp
							timestamp={item.publishedAt}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<div>
				<dt>Feed</dt>
				<dd>
					<ResourceBoundary
						resource={item}
						placeholderText="Loading item…"
					>
						{#snippet children(item)}
							{#if item.$feed}
								<RssFeedView
									entityId={item.$feed[EntityMetaKey.Id]}
									href={resolve('/(social)/(rss)/rss/feed/[feedKey]', {
										feedKey: encodeURIComponent(item.$feed[EntityMetaKey.Id].feedUrl),
										})}
									layout={EntityLayout.Value}
									open={false}
									showTypeAnnotation={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if open}
				<div>
					<dt>Author</dt>
					<dd>
						<ResourceBoundary
							resource={item}
							placeholderText="Loading item…"
						>
							{#snippet children(item)}
								{#if item.author}
									{item.author}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Link</dt>
					<dd>
						<ResourceBoundary
							resource={item}
							placeholderText="Loading item…"
						>
							{#snippet children(item)}
								{#if item.link}
									<a
										href={item.link}
										rel="noreferrer"
										target="_blank"
									>{item.link}</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Description</dt>
					<dd>
						<ResourceBoundary
							resource={item}
							placeholderText="Loading item…"
						>
							{#snippet children(item)}
								{#if item.description}
									{item.description}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.RssItem}
			{entityId}
		/>

		{#if _open}
			<ResourceBoundary
				resource={item}
				placeholderText="Loading item…"
			>
				{#snippet children(item)}
					{#if item.content}
						<section data-column="gap-2">
							<h2>Content</h2>
							<p>{item.content}</p>
						</section>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntityView>
