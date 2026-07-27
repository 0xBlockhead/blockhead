<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'


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
	}: EntitySelectionViewProps<EntityType.NostrProfileMetadataEvent> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const nostrProfileMetadataEvent = $derived(selection({
		fields: {
			pubkey: true,
			kind: true,
			createdAt: true,
			signature: true,
			displayName: true,
			about: true,
			nip05: true,
			lud16: true,
			website: true,
		},
	}))
	const titleFallback = $derived([(pendingEntity.displayName ?? ''), (pendingEntity.nip05 ?? '')].filter(Boolean).join(' ') || (pendingEntity.pubkey ?? '') || 'Nostr profile metadata event')


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
		href ?? resolve(
			'/(social)/(nostr)/nostr/(globalNostrNetwork)/profile-metadata-version/[eventId=stringSegment]',
			{
				eventId: String(selection.entitySelector.eventId),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={nostrProfileMetadataEvent}>
			{#snippet children(entity)}
				{@const reference = entity.$icon}
				{#if reference != null && reference[EntityMetaKey.Selector] !== undefined}
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
		<ResourceBoundary resource={nostrProfileMetadataEvent}>
			{#snippet children(entity)}
				{[(entity.displayName ?? ''), (entity.nip05 ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue value={pendingEntity.eventId} />
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={nostrProfileMetadataEvent}>
			{#snippet children(entity)}
				<span data-text="muted">
					<Timestamp timestamp={Number(entity.createdAt)} />
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			One cryptographically signed kind-0 metadata version for a stable Nostr profile.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Profile</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$profile}
					>
						{#snippet children(nostrProfile)}
							<NostrProfileView
								selection={select(EntityType.NostrProfile, nostrProfile[EntityMetaKey.Selector])}
								prefetched={nostrProfile}
								layout={EntityLayout.Value}
								open={false}
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
									href={String(website)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(website)} />
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
							<Timestamp timestamp={Number(entity.createdAt)} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Event ID</dt>
				<dd>
					<TruncatedValue value={pendingEntity.eventId} />
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
