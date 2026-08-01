<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.NostrProfile>, 'prefetched'> = $props()

	const viewDomId = $derived('nostr-profile-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NostrProfileMetadataEventsView from '$/views/NostrProfileMetadataEventsView.svelte'
	import NostrProfileMetadataEventView from '$/views/NostrProfileMetadataEventView.svelte'
	import NostrNotesView from '$/views/NostrNotesView.svelte'
	import NostrArticlesView from '$/views/NostrArticlesView.svelte'
	import NostrRepostsView from '$/views/NostrRepostsView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrProfile}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? (selection.entitySelector.pubkey || 'Nostr profile')}
	href={
		href === undefined ?
			resolve(
				'/(social)/(nostr)/nostr/(globalNostrNetwork)/profile/[pubkey=stringSegment]',
				{
					pubkey: selection.entitySelector.pubkey,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary
			resource={selection.$latestMetadataEvent}
		>
			{#snippet children(nostrProfileMetadataEvent)}
				{#if nostrProfileMetadataEvent != null}
					<NostrProfileMetadataEventView
						selection={select(EntityType.NostrProfileMetadataEvent, nostrProfileMetadataEvent[EntityMetaKey.Selector])}
						prefetched={nostrProfileMetadataEvent}
						href={null}
						layout={EntityLayout.Title}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Pubkey</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.pubkey} />
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$latestMetadataEvent}
			>
				{#snippet children(nostrProfileMetadataEvent)}
					{#if nostrProfileMetadataEvent != null}
						<div>
							<dt>Latest signed metadata</dt>
							<dd>
								<NostrProfileMetadataEventView
									selection={select(EntityType.NostrProfileMetadataEvent, nostrProfileMetadataEvent[EntityMetaKey.Selector])}
									prefetched={nostrProfileMetadataEvent}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const metadataEventsResource = selection.$$metadataEvents}
		<ResourceBoundary
			resource={metadataEventsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<NostrProfileMetadataEventsView
						selection={metadataEventsResource}
						countResource={metadataEventsResource.count}
						title='Signed metadata history'
						id='metadata-events'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<CollapsibleTabs
			id={viewDomId + '-carousel-nostr-profile-content'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'nostr-profile-notes',
						label: 'Notes',
					},
					{
						id: 'nostr-profile-articles',
						label: 'Articles',
					},
				]
			}
			data-card
			class='network-view-collapsible-content'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Notes and articles</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionNostrProfileNotes({ id, label })}
				<NostrNotesView
					selection={selection.$$notes}
					collapsible={false}
					title={label}
					emptyText='No notes in this observed.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionNostrProfileArticles({ id, label })}
				<NostrArticlesView
					selection={selection.$$articles}
					collapsible={false}
					title={label}
					emptyText='No articles in this observed.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-nostr-profile-engagement'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'nostr-profile-reposts',
						label: 'Reposts',
					},
				]
			}
			data-card
			class='network-view-collapsible-engagement'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Engagement</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionNostrProfileReposts({ id, label })}
				<NostrRepostsView
					selection={selection.$$reposts}
					collapsible={false}
					title={label}
					emptyText='No reposts in this observed.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
