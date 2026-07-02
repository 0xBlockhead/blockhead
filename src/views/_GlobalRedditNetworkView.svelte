<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalRedditNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType._GlobalRedditNetwork>>
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

	const globalRedditNetwork = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			...(open && {
				$$sourceWindowSubreddits: true,
				$$sourceWindowLinks: true,
			}),
		},
	}))
	const titleFallback = $derived('Reddit')
	const viewDomId = $derived('-global-reddit-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import RedditSubredditsView from '$/views/RedditSubredditsView.svelte'
	import RedditLinksView from '$/views/RedditLinksView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalRedditNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{title || 'Reddit'}
		{:else}
			<ResourceBoundary resource={globalRedditNetwork}>
				{#snippet Pending()}
					{title || 'Reddit'}
				{/snippet}

				{#snippet children(entity)}
					{title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<RedditSubredditsView
				selection={selection[EntityProxyField]<EntityType.RedditSubreddit>('$$sourceWindowSubreddits')}
				title='Subreddits'
				href={resolve('/(social)/(reddit)/reddit/subreddits')}
				id='RedditSubredditsView-$$sourceWindowSubreddits'
			/>

			<RedditLinksView
				selection={selection[EntityProxyField]<EntityType.RedditLink>('$$sourceWindowLinks')}
				title='Popular submissions'
				href={resolve('/(social)/(reddit)/reddit/links')}
				id='RedditLinksView-$$sourceWindowLinks'
			/>
		{/if}
	{/snippet}
</EntityView>
