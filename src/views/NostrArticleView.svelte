<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve(
			'/(social)/(nostr)/nostr/article/[pubkey]/[identifier]',
			{
				pubkey: selector.pubkey,
				identifier: selector.identifier,
			},
		),
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.NostrArticle>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const article = subscribe(EntityType.NostrArticle,
		selector,
		({ sources: [
				Source.NostrBand_Rest,
				Source.Primal_Rest,
			], fields: { pubkey: true, identifier: true, title: true, summary: true, imageUrl: true, publishedAt: true, $author: true, ...(open ? ({ content: true }) : ({  })) } }),
	)


	// Components
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import Markdown from '$/components/Markdown.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NostrProfileView from '$/views/NostrProfileView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrArticle}
	entitySelector={selector}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary resource={article}>
			{#snippet children(article)}
				{#if article.fields.imageUrl}
					<IconComponent
						src={article.fields.imageUrl}
						alt={article.fields.title ?? selector.identifier}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue
			value={selector.identifier}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={article}
			placeholderText="Loading article…"
		>
			{#snippet children(article)}
				{article.fields.title ?? selector.identifier}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={article}
		>
			{#snippet children(article)}
				{#if article.fields.publishedAt}
					<span data-text="muted">
						<Timestamp
							timestamp={article.fields.publishedAt}
						/>
					</span>
				{/if}
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

	{#snippet Content({})}
		<ResourceBoundary
			resource={article}
			placeholderText="Loading article…"
		>
			{#snippet children(article)}
				{#if article.fields.summary}
					<p>
						<TruncatedValue
							value={article.fields.summary}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}

				<dl data-column-item="center">
					{#if open && article.fields.$author}
						<div>
							<dt>Author</dt>
							<dd>
								<NostrProfileView
									selector={article.fields.$author[EntityMetaKey.Selector]}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}

					{#if open && article.fields.pubkey}
						<div>
							<dt>Author pubkey</dt>
							<dd>
								<TruncatedValue
									value={article.fields.pubkey}
									format={TruncatedValueFormat.Visual}
								/>
							</dd>
						</div>
					{/if}

					{#if open && article.fields.identifier}
						<div>
							<dt>Identifier</dt>
							<dd>
								<TruncatedValue
									value={article.fields.identifier}
									format={TruncatedValueFormat.Visual}
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
		{@const idKey = stringify(selector)}
		<CollapsibleTabs
			id={`${idKey}:carousel-article`}
			sectionIdPrefix={idKey}
			sections={collapsibleTabsSections([
				{ id: 'body', label: 'Article body' },
			])}
			data-card
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

			{#snippet SectionBody({ id: _id, label: _label })}
				<section data-scroll-marker-label="Article body">
					<ResourceBoundary
						resource={article}
						placeholderText="Loading article…"
					>
						{#snippet children(article)}
							{#if article.fields.content}
								<Markdown content={article.fields.content} />
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
	{/snippet}
</EntityView>
