<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(social)/(nostr)/nostr/profile/[pubkey]', {
			pubkey: entityId.pubkey,
		}),
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.NostrProfile>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()

	const profile = useEntity(entityCollectionsContext, EntityType.NostrProfile,
		entityId,
		({ sources: [
				Source.NostrBand_Rest,
				Source.Primal_Rest,
			], fields: { pubkey: true, displayName: true, about: true, nip05: true, lud16: true, lud06: true, website: true, metadataUpdatedAt: true, $icon: true, $banner: true, ...(open ? ({ $$notes: ({ sources: [
							Source.NostrBand_Rest,
							Source.Primal_Rest,
						] }), $$articles: ({ sources: [
							Source.NostrBand_Rest,
							Source.Primal_Rest,
						] }), $$reposts: ({ sources: [
							Source.NostrBand_Rest,
							Source.Primal_Rest,
						] }) }) : ({  })) } }),
	)


	// (Derived)
	const profileRow = $derived(
		profile.ready ? profile.current : undefined,
	)


	// Components
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import NostrArticlesView from '$/views/NostrArticlesView.svelte'
	import NostrNotesView from '$/views/NostrNotesView.svelte'
	import NostrRepostsView from '$/views/NostrRepostsView.svelte'
</script>


<EntityView
	entityType={EntityType.NostrProfile}
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={profile}
			placeholderText="Loading profile…"
		>
			{#snippet children(profile)}
				{#if (
					profile.fields.$icon
					&& profile.fields.$icon[EntityMetaKey.Id].url
				)}
					<IconComponent
						shape={IconShape.Circle}
						src={profile.fields.$icon[EntityMetaKey.Id].url}
						alt=""
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<TruncatedValue
			value={entityId.pubkey}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={profile}
			placeholderText="Loading profile…"
		>
			{#snippet children(profile)}
				{#if profile.fields.displayName}
					{profile.fields.displayName}
				{:else}
					{#if Value}
					{@render Value()}
				{/if}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Kind-0 profile metadata—display name, bio, nip-05, lud16, and avatar—is a signed replaceable event keyed by pubkey.
		</p>
		<p>
			The profile id is the author’s 64-character lowercase hex pubkey (secp256k1 x-only).
		</p>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			resource={profile}
			placeholderText="Loading profile…"
		>
			{#snippet children(profile)}
				{#if profile.fields.about}
					<p>
						<TruncatedValue
							value={profile.fields.about}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<dl data-column-item="center">
			{#if profileRow?.nip05}
				<div>
					<dt>NIP-05</dt>
					<dd>
						<ResourceBoundary
							resource={profile}
							placeholderText="Loading profile…"
						>
							{#snippet children(profile)}
								{profile.fields.nip05}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& profileRow?.pubkey
			)}
				<div>
					<dt>Pubkey</dt>
					<dd>
						<ResourceBoundary
							resource={profile}
							placeholderText="Loading profile…"
						>
							{#snippet children(profile)}
								<TruncatedValue
									value={profile.fields.pubkey}
									format={TruncatedValueFormat.Visual}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& profileRow?.$banner?.[EntityMetaKey.Id].url
			)}
				<div>
					<dt>Banner</dt>
					<dd>
						<ResourceBoundary
							resource={profile}
							placeholderText="Loading profile…"
							>
								{#snippet children(profile)}
									{#if profile.fields.$banner !== undefined}
										<img
											src={profile.fields.$banner[EntityMetaKey.Id].url}
											alt=""
										/>
									{/if}
								{/snippet}
							</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& profileRow?.website
			)}
				<div>
					<dt>Website</dt>
					<dd>
						<ResourceBoundary
							resource={profile}
							placeholderText="Loading profile…"
						>
							{#snippet children(profile)}
								<a
									href={profile.fields.website}
									rel="noreferrer"
									target="_blank"
								>{profile.fields.website}</a>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
			{#if (
				open
				&& profileRow?.lud16
			)}
				<div>
					<dt>Lightning address</dt>
					<dd>
						<ResourceBoundary
							resource={profile}
							placeholderText="Loading profile…"
						>
							{#snippet children(profile)}
								{profile.fields.lud16}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
			{#if (
				open
				&& profileRow?.lud06
			)}
				<div>
					<dt>Lightning URI</dt>
					<dd>
						<ResourceBoundary
							resource={profile}
							placeholderText="Loading profile…"
						>
							{#snippet children(profile)}
								{profile.fields.lud06}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
			{#if (
				open
				&& profileRow?.metadataUpdatedAt != null
			)}
				<div>
					<dt>Metadata updated</dt>
					<dd>
						<ResourceBoundary
							resource={profile}
							placeholderText="Loading profile…"
						>
							{#snippet children(profile)}
								<Timestamp
									timestamp={profile.fields.metadataUpdatedAt}
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{@const idKey = stringify(entityId)}
		<CollapsibleTabs
			id={`${idKey}:carousel-profile-feed`}
			sectionIdPrefix={idKey}
			sections={collapsibleTabsSections([
				{ id: 'notes', label: 'Notes' },
				{ id: 'articles', label: 'Articles' },
				{ id: 'reposts', label: 'Reposts' },
			])}
			data-card
		>
			{#snippet Summary({ open: _summaryOpen })}
				<header
					data-row-item="flexible"
					data-row="wrap gap-4"
				>
					<HeadingComponent>
						Profile feed
					</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionNotes()}
				<NostrNotesView
					CollapsibleProps={{ canToggle: false }}
					href={resolve(
						'/(social)/(nostr)/nostr/profile/[pubkey]/(profile)/notes',
						{ pubkey: entityId.pubkey },
					)}
					entityFieldReference={{
						entityType: EntityType.NostrProfile,
						entityId,
						fieldName: '$$notes',
					}}
					id={`${idKey}:notes`}
					open={true}
					title="Notes"
				/>
			{/snippet}

			{#snippet SectionArticles()}
				<NostrArticlesView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.NostrProfile,
						entityId,
						fieldName: '$$articles',
					}}
					id={`${idKey}:articles`}
					open={true}
					title="Articles"
				/>
			{/snippet}

			{#snippet SectionReposts()}
				<NostrRepostsView
					CollapsibleProps={{ canToggle: false }}
					entityFieldReference={{
						entityType: EntityType.NostrProfile,
						entityId,
						fieldName: '$$reposts',
					}}
					id={`${idKey}:reposts`}
					open={true}
					title="Reposts"
				/>
			{/snippet}
	</CollapsibleTabs>
	{/snippet}
</EntityView>
