<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
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
			selection: RegisteredEntityProxyResource<EntityType._GlobalNostrNetwork>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType._GlobalNostrNetwork>>
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const globalNostrNetwork = $derived(selection({
		sources: selection.sources,
		fields: {
			protocolName: true,
			registryName: true,
			homeUrl: true,
			docsUrl: true,
			relationshipModel: true,
		},
	}))
	const titleFallback = $derived(['Nostr'].filter(Boolean).join(' ') || 'Nostr')
	const viewDomId = $derived('-global-nostr-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={href ?? (pendingEntity.scope === '_GlobalNostrNetwork' ? resolve('/nostr') : undefined)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{['Nostr'].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={globalNostrNetwork}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{['Nostr'].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Nostr is a relay-based social protocol for signed events. Profiles, notes, reposts, and articles are event kinds; relays are transport endpoints and are not global proof that an event exists everywhere.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							registryName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const registryName = resolvedEntity.registryName}
					{#if registryName !== undefined && registryName !== null}
						<div>
							<dt>Registry name</dt>
							<dd>
								{String((registryName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							protocolName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const protocolName = resolvedEntity.protocolName}
					{#if protocolName !== undefined && protocolName !== null}
						<div>
							<dt>Protocol</dt>
							<dd>
								{String((protocolName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								homeUrl: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const homeUrl = resolvedEntity.homeUrl}
						{#if homeUrl !== undefined && homeUrl !== null}
							<div>
								<dt>Home</dt>
								<dd>
									<svelte:element
										this={'a'}
										href={String(homeUrl)}
										target="_blank"
										rel="noreferrer noopener"
									>
										<TruncatedValue value={String(homeUrl)} />
									</svelte:element>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								docsUrl: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const docsUrl = resolvedEntity.docsUrl}
						{#if docsUrl !== undefined && docsUrl !== null}
							<div>
								<dt>NIPs</dt>
								<dd>
									<svelte:element
										this={'a'}
										href={String(docsUrl)}
										target="_blank"
										rel="noreferrer noopener"
									>
										<TruncatedValue value={String(docsUrl)} />
									</svelte:element>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: selection.sources,
							fields: {
								relationshipModel: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const relationshipModel = resolvedEntity.relationshipModel}
						{#if relationshipModel !== undefined && relationshipModel !== null}
							<div>
								<dt>Connection model</dt>
								<dd>
									<span data-text="long-text">{String((relationshipModel) ?? '')}</span>
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
						selection={
							selection.$$observedProfiles({
								sources: [
									Source.NostrBand_Rest,
								],
							})
						}
						href={resolve('/nostr/profiles')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No Nostr profiles in this observed.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionNostrRelays({ id, label, open })}
					<NostrRelaysView
						selection={
							selection.$$observedRelays({
								sources: [
									Source.Constants_Internal,
									Source.NostrBand_Rest,
								],
							})
						}
						href={resolve('/nostr/relays')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No Nostr relays in this observed.'
						open={open}
						title={label}
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
						selection={
							selection.$$observedNotes({
								sources: [
									Source.Constants_Internal,
									Source.NostrBand_Rest,
								],
							})
						}
						href={resolve('/nostr/notes')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No Nostr notes in this observed.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionNostrArticles({ id, label, open })}
					<NostrArticlesView
						selection={
							selection.$$observedArticles({
								sources: [
									Source.Constants_Internal,
									Source.NostrBand_Rest,
								],
							})
						}
						href={resolve('/nostr/articles')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No Nostr articles in this observed.'
						open={open}
						title={label}
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
						selection={
							selection.$$observedReposts({
								sources: [
									Source.Constants_Internal,
									Source.NostrBand_Rest,
								],
							})
						}
						href={resolve('/nostr/reposts')}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No Nostr reposts in this observed.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
