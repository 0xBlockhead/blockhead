<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { getIsInsideEntityList } from '$/context/isInsideEntityList.ts'
	import { resolve } from '$app/paths'


	// Props
	let {
		entityId,
		href = resolve('/nostr/profile/[pubkey]', {
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
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const profile = useEntity(
		EntityType.NostrProfile,
		entityId,
		{
			$: [
				Source.NostrBand_Rest,
				Source.Primal_Rest,
			],
			displayName: {},
			about: {},
			nip05: {},
			lud16: {},
			lud06: {},
			website: {},
			createdAt: {},
			$icon: {},
			$banner: {},
			...(open ?
				{
					$$notes: {
						$: [
							Source.NostrBand_Rest,
							Source.Primal_Rest,
						],
					},
					$$articles: {
						$: [
							Source.NostrBand_Rest,
							Source.Primal_Rest,
						],
					},
					$$reposts: {
						$: [
							Source.NostrBand_Rest,
							Source.Primal_Rest,
						],
					},
				}
			:
				{}),
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
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
			{#snippet children(loadedProfile)}
				{#if loadedProfile.displayName}
					{loadedProfile.displayName}
				{:else}
					<TruncatedValue
						value={entityId.pubkey}
						format={TruncatedValueFormat.Visual}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Icon()}
		<ResourceBoundary
			resource={profile}
			placeholderText="Loading profile…"
		>
			{#snippet children(loadedProfile)}
				{#if (
					profile.$icon
					&& profile.$icon[EntityMetaKey.Id].url
				)}
					<IconComponent
						shape={IconShape.Circle}
						src={loadedProfile.$icon[EntityMetaKey.Id].url}
						alt=""
					/>
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

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			{#if loadedProfile.about}
				<div>
					<dt>Bio</dt>
					<dd>
						<ResourceBoundary
							resource={profile}
							placeholderText="Loading profile…"
						>
							{#snippet children(loadedProfile)}
								{loadedProfile.about}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if loadedProfile.nip05}
				<div>
					<dt>NIP-05</dt>
					<dd>
						<ResourceBoundary
							resource={profile}
							placeholderText="Loading profile…"
						>
							{#snippet children(loadedProfile)}
								{loadedProfile.nip05}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& profile.$banner?.[EntityMetaKey.Id].url
			)}
				<div>
					<dt>Banner</dt>
					<dd>
						<ResourceBoundary
							resource={profile}
							placeholderText="Loading profile…"
						>
							{#snippet children(loadedProfile)}
								<img
									src={loadedProfile.$banner[EntityMetaKey.Id].url}
									alt=""
								/>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if (
				open
				&& profile.website
			)}
				<div>
					<dt>Website</dt>
					<dd>
						<ResourceBoundary
							resource={profile}
							placeholderText="Loading profile…"
						>
							{#snippet children(loadedProfile)}
								<a
									href={loadedProfile.website}
									rel="noreferrer"
									target="_blank"
								>{loadedProfile.website}</a>
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
			{#if (
				open
				&& profile.lud16
			)}
				<div>
					<dt>Lightning address</dt>
					<dd>
						<ResourceBoundary
							resource={profile}
							placeholderText="Loading profile…"
						>
							{#snippet children(loadedProfile)}
								{loadedProfile.lud16}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
			{#if (
				open
				&& profile.lud06
			)}
				<div>
					<dt>Lightning URI</dt>
					<dd>
						<ResourceBoundary
							resource={profile}
							placeholderText="Loading profile…"
						>
							{#snippet children(loadedProfile)}
								{loadedProfile.lud06}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
			{#if (
				open
				&& profile.createdAt != null
			)}
				<div>
					<dt>Created</dt>
					<dd>
						<ResourceBoundary
							resource={profile}
							placeholderText="Loading profile…"
						>
							{#snippet children(loadedProfile)}
								<Timestamp
									timestamp={loadedProfile.createdAt}
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
		<EntityDetails
			entityType={EntityType.NostrProfile}
			{entityId}
		/>
		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${idKey}:carousel-profile-feed`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
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

				{#snippet Markers({ open: _markersOpen })}
					<a
						data-scroll-marker-label="Notes"
						href={`#${idKey}:notes`}
					>Notes</a>
					<a
						data-scroll-marker-label="Articles"
						href={`#${idKey}:articles`}
					>Articles</a>
					<a
						data-scroll-marker-label="Reposts"
						href={`#${idKey}:reposts`}
					>Reposts</a>
				{/snippet}

				{#snippet body({ open: _sectionOpen })}
					<section data-scroll-marker-label="Notes">
						<NostrNotesView
							href={resolve(
			'/(social)/(nostr)/nostr/profile/[pubkey]/(profile)/notes',
			{ pubkey: entityId.pubkey },
		)}
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.NostrProfile,
								entityId,
								fieldName: '$$notes',
							}}
							id={`${idKey}:notes`}
							open={_sectionOpen}
							title="Notes"
						/>
					</section>

					<section data-scroll-marker-label="Articles">
						<NostrArticlesView
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.NostrProfile,
								entityId,
								fieldName: '$$articles',
							}}
							id={`${idKey}:articles`}
							open={_sectionOpen}
							title="Articles"
						/>
					</section>

					<section data-scroll-marker-label="Reposts">
						<NostrRepostsView
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.NostrProfile,
								entityId,
								fieldName: '$$reposts',
							}}
							id={`${idKey}:reposts`}
							open={_sectionOpen}
							title="Reposts"
						/>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>

