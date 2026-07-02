<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.RedditSubreddit>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.RedditSubreddit>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const redditSubreddit = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			$icon: true,
			title: true,
			publicDescription: true,
			createdAt: true,
			over18: true,
			...(open && {
				$$links: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).title) ?? '')].filter(Boolean).join(' ') || ['r/' + String((selection.entitySelector.name) ?? '')].filter(Boolean).join(' ') || 'Reddit subreddit')
	const viewDomId = $derived('reddit-subreddit-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import RedditLinksView from '$/views/RedditLinksView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.RedditSubreddit}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={redditSubreddit}>
			{#snippet Pending()}
				<IconComponent />
			{/snippet}

			{#snippet children(entity)}
				{@const reference = entity.$icon}
				{#if reference?.[EntityMetaKey.Selector] !== undefined}
					<MediaView
						selection={select(EntityType.Media, reference[EntityMetaKey.Selector])}
						prefetched={reference}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).title) ?? '')].filter(Boolean).join(' ') || title || ['r/' + String((selection.entitySelector.name) ?? '')].filter(Boolean).join(' ') || 'Reddit subreddit'}
		{:else}
			<ResourceBoundary resource={redditSubreddit}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).title) ?? '')].filter(Boolean).join(' ') || title || ['r/' + String((selection.entitySelector.name) ?? '')].filter(Boolean).join(' ') || 'Reddit subreddit'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.title) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			{#if contentOpen}
				<ResourceBoundary resource={redditSubreddit}>
					{#snippet Pending()}
						{@const publicDescription = prefetched.publicDescription ?? selection.entitySelector.publicDescription}
						{#if publicDescription !== undefined && publicDescription !== null}
							<div>
								<dt>Public description</dt>
								<dd>
									<span data-text="long-text">{String((publicDescription) ?? '')}</span>
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const publicDescription = entity.publicDescription ?? selection.entitySelector.publicDescription ?? prefetched.publicDescription}
						{#if publicDescription !== undefined && publicDescription !== null}
							<div>
								<dt>Public description</dt>
								<dd>
									<span data-text="long-text">{String((publicDescription) ?? '')}</span>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={redditSubreddit}>
					{#snippet Pending()}
						{@const createdAt = prefetched.createdAt ?? selection.entitySelector.createdAt}
						{#if createdAt !== undefined && createdAt !== null}
							<div>
								<dt>Created</dt>
								<dd>
									<Timestamp timestamp={Number(createdAt)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const createdAt = entity.createdAt ?? selection.entitySelector.createdAt ?? prefetched.createdAt}
						{#if createdAt !== undefined && createdAt !== null}
							<div>
								<dt>Created</dt>
								<dd>
									<Timestamp timestamp={Number(createdAt)} />
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary resource={redditSubreddit}>
					{#snippet Pending()}
						{@const over18 = prefetched.over18 ?? selection.entitySelector.over18}
						{#if over18 !== undefined && over18 !== null}
							<div>
								<dt>NSFW</dt>
								<dd>
									{String((over18) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const over18 = entity.over18 ?? selection.entitySelector.over18 ?? prefetched.over18}
						{#if over18 !== undefined && over18 !== null}
							<div>
								<dt>NSFW</dt>
								<dd>
									{String((over18) ?? '')}
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<RedditLinksView
				selection={selection[EntityProxyField]<EntityType.RedditLink>('$$links')}
				title='Submissions'
				href={resolve('/(social)/(reddit)/reddit/links')}
				id='RedditLinksView-$$links'
			/>
		{/if}
	{/snippet}
</EntityView>
