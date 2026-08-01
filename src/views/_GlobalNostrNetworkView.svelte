<!-- Generated from APP.ts. Do not edit by hand. -->

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
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType._GlobalNostrNetwork> = $props()

	const globalNostrNetwork = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
	})({
		fields: {
			protocolName: true,
			registryName: true,
			homeUrl: true,
			docsUrl: true,
			relationshipModel: true,
		},
	}))
	const viewDomId = $derived('-global-nostr-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NostrProfilesView from '$/views/NostrProfilesView.svelte'
	import NostrRelaysView from '$/views/NostrRelaysView.svelte'
	import NostrNotesView from '$/views/NostrNotesView.svelte'
	import NostrArticlesView from '$/views/NostrArticlesView.svelte'
	import NostrRepostsView from '$/views/NostrRepostsView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalNostrNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	href={
		href === undefined ?
			resolve('/(social)/(nostr)/nostr')
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={globalNostrNetwork}
			>
				{#snippet children(entity)}
					{@const registryName = entity.registryName}
					{#if registryName != null}
						<div>
							<dt>Registry name</dt>
							<dd>
								{registryName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={globalNostrNetwork}
			>
				{#snippet children(entity)}
					{@const protocolName = entity.protocolName}
					{#if protocolName != null}
						<div>
							<dt>Protocol</dt>
							<dd>
								{protocolName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
				<ResourceBoundary
					resource={globalNostrNetwork}
				>
					{#snippet children(entity)}
						{@const homeUrl = entity.homeUrl}
						{#if homeUrl != null}
							<div>
								<dt>Home</dt>
								<dd>
									<a
										href={homeUrl}
										target="_blank"
										rel="noreferrer noopener"
									>
										<TruncatedValue value={homeUrl} />
									</a>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={globalNostrNetwork}
				>
					{#snippet children(entity)}
						{@const docsUrl = entity.docsUrl}
						{#if docsUrl != null}
							<div>
								<dt>NIPs</dt>
								<dd>
									<a
										href={docsUrl}
										target="_blank"
										rel="noreferrer noopener"
									>
										<TruncatedValue value={docsUrl} />
									</a>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={globalNostrNetwork}
				>
					{#snippet children(entity)}
						{@const relationshipModel = entity.relationshipModel}
						{#if relationshipModel != null}
							<div>
								<dt>Connection model</dt>
								<dd>
									<span data-text="long-text">{relationshipModel}</span>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-nostr-directory'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'nostr-profiles',
						label: 'Profiles',
					},
					{
						id: 'nostr-relays',
						label: 'Relays',
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

			{#snippet SectionNostrProfiles({ id, label, open })}
				<NostrProfilesView
					selection={selection.$$observedProfiles}
					href={resolve('/(social)/(nostr)/nostr/(globalNostrNetwork)/profiles')}
					collapsible={false}
					title={label}
					emptyText='No Nostr profiles in this observed.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionNostrRelays({ id, label, open })}
				<NostrRelaysView
					selection={selection.$$observedRelays}
					href={resolve('/(social)/(nostr)/nostr/(globalNostrNetwork)/relays')}
					collapsible={false}
					title={label}
					emptyText='No Nostr relays in this observed.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-nostr-content'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'nostr-notes',
						label: 'Notes',
					},
					{
						id: 'nostr-articles',
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

			{#snippet SectionNostrNotes({ id, label, open })}
				<NostrNotesView
					selection={selection.$$observedNotes}
					href={resolve('/(social)/(nostr)/nostr/(globalNostrNetwork)/notes')}
					collapsible={false}
					title={label}
					emptyText='No Nostr notes in this observed.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionNostrArticles({ id, label, open })}
				<NostrArticlesView
					selection={selection.$$observedArticles}
					href={resolve('/(social)/(nostr)/nostr/(globalNostrNetwork)/articles')}
					collapsible={false}
					title={label}
					emptyText='No Nostr articles in this observed.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-nostr-engagement'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'nostr-reposts',
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

			{#snippet SectionNostrReposts({ id, label, open })}
				<NostrRepostsView
					selection={selection.$$observedReposts}
					href={resolve('/(social)/(nostr)/nostr/(globalNostrNetwork)/reposts')}
					collapsible={false}
					title={label}
					emptyText='No Nostr reposts in this observed.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
