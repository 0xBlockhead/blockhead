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
			selection: RegisteredEntityProxyResource<EntityType.NostrProfile>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.NostrProfile>>
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
	const nostrProfile = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			displayName: true,
			about: true,
			nip05: true,
			website: true,
			metadataUpdatedAt: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.displayName) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.pubkey) ?? '')].filter(Boolean).join(' ') || 'Nostr profile')
	const viewDomId = $derived('nostr-profile-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NostrNotesView from '$/views/NostrNotesView.svelte'
	import NostrArticlesView from '$/views/NostrArticlesView.svelte'
	import NostrRepostsView from '$/views/NostrRepostsView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrProfile}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.pubkey !== undefined ? resolve('/nostr/profile/[pubkey=stringSegment]', {
			pubkey: String(pendingEntity.pubkey ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={nostrProfile}>
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
		<ResourceBoundary resource={nostrProfile}>
			{#snippet Pending()}
				{[String((pendingEntity.displayName) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.pubkey) ?? '')].filter(Boolean).join(' ') || 'Nostr profile'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.displayName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
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
			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Constants_Internal,
							Source.NostrBand_Rest,
						],
						fields: {
							displayName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const displayName = pendingEntity.displayName}
					{#if displayName !== undefined && displayName !== null}
						<div>
							<dt>Display name</dt>
							<dd>
								{String((displayName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const displayName = resolvedEntity.displayName}
					{#if displayName !== undefined && displayName !== null}
						<div>
							<dt>Display name</dt>
							<dd>
								{String((displayName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Constants_Internal,
							Source.NostrBand_Rest,
						],
						fields: {
							about: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const about = pendingEntity.about}
					{#if about !== undefined && about !== null}
						<div>
							<dt>About</dt>
							<dd>
								<span data-text="long-text">{String((about) ?? '')}</span>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const about = resolvedEntity.about}
					{#if about !== undefined && about !== null}
						<div>
							<dt>About</dt>
							<dd>
								<span data-text="long-text">{String((about) ?? '')}</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: [
							Source.Constants_Internal,
							Source.NostrBand_Rest,
						],
						fields: {
							nip05: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nip05 = pendingEntity.nip05}
					{#if nip05 !== undefined && nip05 !== null}
						<div>
							<dt>NIP-05</dt>
							<dd>
								{String((nip05) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nip05 = resolvedEntity.nip05}
					{#if nip05 !== undefined && nip05 !== null}
						<div>
							<dt>NIP-05</dt>
							<dd>
								{String((nip05) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if contentOpen}
				<div>
					<dt>Pubkey</dt>
					<dd>
						<ResourceBoundary
							resource={
								selection({
									fields: {
										pubkey: true,
									},
								})
							}
						>
							{#snippet Pending()}
								{@const pubkey = pendingEntity.pubkey}
								{#if pubkey !== undefined && pubkey !== null}
									<TruncatedValue value={String((pubkey) ?? '')} />
								{/if}
							{/snippet}

							{#snippet children(entity)}
								{@const resolvedEntity = { ...pendingEntity, ...entity }}
								{@const pubkey = resolvedEntity.pubkey}
								{#if pubkey !== undefined && pubkey !== null}
									<TruncatedValue value={String((pubkey) ?? '')} />
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<ResourceBoundary
					resource={
						selection({
							sources: [
								Source.Constants_Internal,
								Source.NostrBand_Rest,
							],
							fields: {
								website: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const website = pendingEntity.website}
						{#if website !== undefined && website !== null}
							<div>
								<dt>Website</dt>
								<dd>
									<svelte:element
										this={'a'}
										href={String(website)}
										target="_blank"
										rel="noreferrer noopener"
									>
										<TruncatedValue value={String(website)} />
									</svelte:element>
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const website = resolvedEntity.website}
						{#if website !== undefined && website !== null}
							<div>
								<dt>Website</dt>
								<dd>
									<svelte:element
										this={'a'}
										href={String(website)}
										target="_blank"
										rel="noreferrer noopener"
									>
										<TruncatedValue value={String(website)} />
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
							sources: [
								Source.Constants_Internal,
								Source.NostrBand_Rest,
							],
							fields: {
								metadataUpdatedAt: true,
							},
						})
					}
				>
					{#snippet Pending()}
						{@const metadataUpdatedAt = pendingEntity.metadataUpdatedAt}
						{#if metadataUpdatedAt !== undefined && metadataUpdatedAt !== null}
							<div>
								<dt>Metadata updated</dt>
								<dd>
									<Timestamp timestamp={Number(metadataUpdatedAt)} />
								</dd>
							</div>
						{/if}
					{/snippet}

					{#snippet children(entity)}
						{@const resolvedEntity = { ...pendingEntity, ...entity }}
						{@const metadataUpdatedAt = resolvedEntity.metadataUpdatedAt}
						{#if metadataUpdatedAt !== undefined && metadataUpdatedAt !== null}
							<div>
								<dt>Metadata updated</dt>
								<dd>
									<Timestamp timestamp={Number(metadataUpdatedAt)} />
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Notes and articles</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionNostrProfileNotes({ id, label, open })}
					<NostrNotesView
						selection={
							selection.$$notes({
								sources: [
									Source.Constants_Internal,
									Source.NostrBand_Rest,
								],
								count: true,
							})
						}
						href={resolve('/nostr/notes')}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No notes in this observed.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionNostrProfileArticles({ id, label, open })}
					<NostrArticlesView
						selection={
							selection.$$articles({
								sources: [
									Source.Constants_Internal,
									Source.NostrBand_Rest,
								],
								count: true,
							})
						}
						href={resolve('/nostr/articles')}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No articles in this observed.'
						open={open}
						title={label}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Engagement</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionNostrProfileReposts({ id, label, open })}
					<NostrRepostsView
						selection={
							selection.$$reposts({
								sources: [
									Source.Constants_Internal,
									Source.NostrBand_Rest,
								],
								count: true,
							})
						}
						href={resolve('/nostr/reposts')}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No reposts in this observed.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
