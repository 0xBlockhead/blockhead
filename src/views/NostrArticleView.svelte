<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'

	import { stringify } from 'devalue'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.NostrArticle>
			href: string
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
			| 'Content'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const article = useEntity(
		EntityType.NostrArticle,
		entityId,
		{
			$: [
				Source.NostrBand_Rest,
				Source.Primal_Rest,
			],
			title: {},
			summary: {},
			imageUrl: {},
			publishedAt: {},
			$author: {},
			...(open ?
				{
					content: {},
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
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NostrProfileView from '$/views/NostrProfileView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrArticle}
	{entityId}
	{href}
	bind:open
	{...entityViewRest}
>
	{#snippet Value()}
		<TruncatedValue
			value={entityId.identifier}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={article}
			placeholderText="Loading article…"
		>
			{#snippet children(article)}
				{article.title ?? entityId.identifier}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			NIP-23 kind-30023 articles bundle title, summary, hero image, and markdown body in a parameterized replaceable event.
		</p>
		<p>
			Stable ids combine the author pubkey (64 lowercase hex) with the replaceable <code>d</code>-tag—not a kind-1 note event hash.
		</p>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={article}
			placeholderText=""
		>
			{#snippet children(article)}
				{#if article.publishedAt}
					<span data-text="muted">
						<Timestamp
							timestamp={article.publishedAt}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			{#if article.summary}
				<div>
					<dt>Summary</dt>
					<dd>
						<ResourceBoundary
							resource={article}
							placeholderText="Loading article…"
						>
							{#snippet children(article)}
								{article.summary}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				{#if article.$author}
					<div>
						<dt>Author</dt>
						<dd>
							<ResourceBoundary
								resource={article}
								placeholderText="Loading article…"
							>
								{#snippet children(article)}
									<NostrProfileView
										entityId={article.$author[EntityMetaKey.Id]}
										href={resolve('/nostr/profile/[pubkey]', {
											pubkey: article.$author[EntityMetaKey.Id].pubkey,
											})}
										layout={EntityLayout.Value}
										open={false}
										showTypeAnnotation={false}
									/>
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
			{/if}

			{#if open}
				{#if article.imageUrl}
					<div>
						<dt>Hero image</dt>
						<dd>
							<ResourceBoundary
								resource={article}
								placeholderText="Loading article…"
							>
								{#snippet children(article)}
									<a
										href={article.imageUrl}
										rel="noreferrer"
										target="_blank"
									>{article.imageUrl}</a>
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{@const idKey = stringify(entityId)}
		<EntityDetails
			entityType={EntityType.NostrArticle}
			{entityId}
		/>

		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${idKey}:carousel-article`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _summaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Article body
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Article body"
						href={`#${idKey}:content`}
					>Body</a>
				{/snippet}

				{#snippet body({ open: _sectionOpen })}
					<section data-scroll-marker-label="Article body">
						<ResourceBoundary
							resource={article}
							placeholderText="Loading article…"
						>
							{#snippet children(article)}
								{#if article.content}
									<p>{article.content}</p>
								{:else}
									<p data-text="muted">
										No article body yet.
									</p>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>

