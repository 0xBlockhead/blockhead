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
			selection: EntityProxyResource<typeof schema, EntityType.NostrProfile>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.NostrProfile>>
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
			$icon: true,
			...(open && {
				$$notes: true,
				$$articles: true,
				$$reposts: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.pubkey) ?? '')].filter(Boolean).join(' ') || 'Nostr profile')
	const viewDomId = $derived('nostr-profile-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
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
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.pubkey) ?? '')].filter(Boolean).join(' ') || 'Nostr profile'}
		{:else}
			<ResourceBoundary resource={nostrProfile}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).displayName) ?? '')].filter(Boolean).join(' ') || title || [String((selection.entitySelector.pubkey) ?? '')].filter(Boolean).join(' ') || 'Nostr profile'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.displayName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A Nostr profile is replaceable kind-0 metadata keyed by a 64-character lowercase hex public key.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={nostrProfile}>
				{#snippet Pending()}
					{@const about = prefetched.about ?? selection.entitySelector.about}
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
					{@const about = entity.about ?? selection.entitySelector.about ?? prefetched.about}
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

			<ResourceBoundary resource={nostrProfile}>
				{#snippet Pending()}
					{@const nip05 = prefetched.nip05 ?? selection.entitySelector.nip05}
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
					{@const nip05 = entity.nip05 ?? selection.entitySelector.nip05 ?? prefetched.nip05}
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
				<ResourceBoundary resource={nostrProfile}>
					{#snippet Pending()}
						{@const website = prefetched.website ?? selection.entitySelector.website}
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
						{@const website = entity.website ?? selection.entitySelector.website ?? prefetched.website}
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
				<ResourceBoundary resource={nostrProfile}>
					{#snippet Pending()}
						{@const metadataUpdatedAt = prefetched.metadataUpdatedAt ?? selection.entitySelector.metadataUpdatedAt}
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
						{@const metadataUpdatedAt = entity.metadataUpdatedAt ?? selection.entitySelector.metadataUpdatedAt ?? prefetched.metadataUpdatedAt}
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
			<NostrNotesView
				selection={selection[EntityProxyField]<EntityType.NostrNote>('$$notes')}
				title='Notes'
				href={resolve('/(social)/(nostr)/nostr/notes')}
				emptyText='No notes in this source window.'
				id='NostrNotesView-$$notes'
			/>

			<NostrArticlesView
				selection={selection[EntityProxyField]<EntityType.NostrArticle>('$$articles')}
				title='Articles'
				href={resolve('/(social)/(nostr)/nostr/articles')}
				emptyText='No articles in this source window.'
				id='NostrArticlesView-$$articles'
			/>

			<NostrRepostsView
				selection={selection[EntityProxyField]<EntityType.NostrRepost>('$$reposts')}
				title='Reposts'
				href={resolve('/(social)/(nostr)/nostr/reposts')}
				emptyText='No reposts in this source window.'
				id='NostrRepostsView-$$reposts'
			/>
		{/if}
	{/snippet}
</EntityView>
