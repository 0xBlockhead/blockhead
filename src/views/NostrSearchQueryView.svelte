<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
	}: EntitySelectionViewProps<EntityType.NostrSearchQuery> = $props()

	const nostrSearchQuery = $derived(selection({
		sources: selection.sources ?? [
			Source.NostrBand_Rest,
		],
	})({
		fields: {
			resultCount: true,
			completed: true,
		},
	}))
	const viewDomId = $derived('nostr-search-query-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NostrProfilesView from '$/views/NostrProfilesView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrSearchQuery}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? (['Search: ', selection.entitySelector.query].filter(Boolean).join(' ') || 'Nostr profile search')}
	href={
		href === undefined ?
			resolve(
				'/(social)/(nostr)/nostr/(globalNostrNetwork)/search/[query=stringSegment]',
				{
					query: selection.entitySelector.query,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={nostrSearchQuery}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.resultCount}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Query</dt>
				<dd>
					{selection.entitySelector.query}
				</dd>
			</div>

			<div>
				<dt>Results</dt>
				<dd>
					<ResourceBoundary
						resource={nostrSearchQuery}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.resultCount}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Completed</dt>
				<dd>
					<ResourceBoundary
						resource={nostrSearchQuery}
					>
						{#snippet children(entity)}
							{entity.completed ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-nostr-search-results'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'nostr-search-profiles',
						label: 'Profiles',
					},
				]
			}
			data-card
			class='network-view-collapsible-results'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Profile results</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionNostrSearchProfiles({ id, label, open })}
				<NostrProfilesView
					selection={selection.$$profiles}
					collapsible={false}
					title={label}
					emptyText='No matching Nostr profiles.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
