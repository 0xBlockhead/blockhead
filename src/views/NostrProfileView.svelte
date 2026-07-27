<!-- Generated from APP.ts. Do not edit by hand. -->

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
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.NostrProfile> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = $derived((pendingEntity.pubkey ?? '') || 'Nostr profile')
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
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(social)/(nostr)/nostr/(globalNostrNetwork)/profile/[pubkey=stringSegment]',
			{
				pubkey: String(selection.entitySelector.pubkey),
			}
		)
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
						href=""
						layout={EntityLayout.Title}
						open={false}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A Nostr profile is replaceable kind-0 metadata keyed by a 64-character lowercase hex public key.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Pubkey</dt>
				<dd>
					<TruncatedValue value={pendingEntity.pubkey} />
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
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const nostrProfileNostrProfileMetadataEventsViewMetadataEventsResource = selection.$$metadataEvents}
		<ResourceBoundary
			resource={nostrProfileNostrProfileMetadataEventsViewMetadataEventsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<NostrProfileMetadataEventsView
						selection={nostrProfileNostrProfileMetadataEventsViewMetadataEventsResource}
						countResource={nostrProfileNostrProfileMetadataEventsViewMetadataEventsResource.count}
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

			{#snippet SectionNostrProfileNotes({ id, label, open })}
				<NostrNotesView
					selection={selection.$$notes}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No notes in this observed.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionNostrProfileArticles({ id, label, open })}
				<NostrArticlesView
					selection={selection.$$articles}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
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

			{#snippet SectionNostrProfileReposts({ id, label, open })}
				<NostrRepostsView
					selection={selection.$$reposts}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No reposts in this observed.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
