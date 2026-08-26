<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.NostrProfileMetadataEvent> = $props()

	const nostrProfileMetadataEvent = $derived(selection({
		fields: {
			pubkey: true,
			createdAt: true,
			signature: true,
			displayName: true,
			about: true,
			nip05: true,
			lud16: true,
			website: true,
		},
	}))
	const titleFallback = $derived([(prefetched.displayName ?? ''), (prefetched.nip05 ?? '')].filter(Boolean).join(' ') || (prefetched.pubkey ?? '') || 'Nostr profile metadata event')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NostrProfileView from '$/views/NostrProfileView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrProfileMetadataEvent}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(social)/(nostr)/nostr/(globalNostrNetwork)/profile-metadata-version/[eventId=stringSegment]',
				{
					eventId: selection.entitySelector.eventId,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary resource={nostrProfileMetadataEvent}>
			{#snippet children(entity)}
				{@const reference = entity.$icon}
				{#if reference != null}
					<MediaView
						selection={select(EntityType.Media, reference[EntityMetaKey.Selector])}
						prefetched={reference}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={nostrProfileMetadataEvent}>
			{#snippet children(entity)}
				{[(entity.displayName ?? ''), (entity.nip05 ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={selection.entitySelector.eventId} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nostrProfileMetadataEvent}>
			{#snippet children(entity)}
				<span data-text="muted">
					<Timestamp timestamp={entity.createdAt} />
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Profile</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$profile}
					>
						{#snippet children(nostrProfile)}
							{@const nostrProfileInitial = untrack(() => nostrProfile)}
							<NostrProfileView
								selection={select(EntityType.NostrProfile, (nostrProfile ?? nostrProfileInitial)[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={nostrProfileMetadataEvent}
			>
				{#snippet children(entity)}
					{@const displayName = entity.displayName}
					{#if displayName != null}
						<div>
							<dt>Display name</dt>
							<dd>
								{displayName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={nostrProfileMetadataEvent}
			>
				{#snippet children(entity)}
					{@const nip05 = entity.nip05}
					{#if nip05 != null}
						<div>
							<dt>NIP-05</dt>
							<dd>
								{nip05}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={nostrProfileMetadataEvent}
			>
				{#snippet children(entity)}
					{@const website = entity.website}
					{#if website != null}
						<div>
							<dt>Website</dt>
							<dd>
								<a
									href={website}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={website} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={nostrProfileMetadataEvent}
			>
				{#snippet children(entity)}
					{@const lud16 = entity.lud16}
					{#if lud16 != null}
						<div>
							<dt>Lightning address</dt>
							<dd>
								{lud16}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Created</dt>
				<dd>
					<ResourceBoundary
						resource={nostrProfileMetadataEvent}
					>
						{#snippet children(entity)}
							<Timestamp timestamp={entity.createdAt} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Event ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.eventId} />
				</dd>
			</div>

			<div>
				<dt>Signature</dt>
				<dd>
					<ResourceBoundary
						resource={nostrProfileMetadataEvent}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.signature} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<ResourceBoundary
			resource={nostrProfileMetadataEvent}
		>
			{#snippet children(entity)}
				{@const about = entity.about}
				{#if about != null && about !== ''}
					<p data-text="long-text">{about}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
