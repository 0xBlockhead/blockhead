<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType._GlobalRedditNetwork> = $props()

	const titleFallback = 'Reddit'
	const viewDomId = $derived('-global-reddit-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import RedditSubredditsView from '$/views/RedditSubredditsView.svelte'
	import RedditLinksView from '$/views/RedditLinksView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalRedditNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={href ?? resolve('/(social)/(reddit)/reddit')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		Reddit
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Scope</dt>
				<dd>
					Reddit
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-reddit-directory'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'reddit-subreddits',
						label: 'Subreddits',
					},
					{
						id: 'reddit-links',
						label: 'Links',
					},
				]
			}
			data-card
			class='network-view-collapsible-directory'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Directory</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionRedditSubreddits({ id, label, open })}
				<RedditSubredditsView
					selection={selection.$$observedSubreddits}
					href={resolve('/(social)/(reddit)/reddit/(globalRedditNetwork)/subreddits')}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionRedditLinks({ id, label, open })}
				<RedditLinksView
					selection={selection.$$observedLinks}
					href={resolve('/(social)/(reddit)/reddit/(globalRedditNetwork)/links')}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
