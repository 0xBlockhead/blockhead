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
		href,
		open = $bindable(
			!(getIsInsideEntityList() ?? false),
		),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.NostrProfile>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'Icon'
			| 'Content'
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
	{href}
	bind:open
	{...entityViewRest}
>
	{#snippet Value()}
		<TruncatedValue
			value={entityId.pubkey}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

		{Title()}
		<ResourceBoundary
			resource={profile}
			placeholderText="Loading profile…"
		>
			{#snippet children(profile)}
				{#if profile.displayName}
					{profile.displayName}
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
			{#snippet children(profile)}
				{#if profile.$icon}
					{#if profile.$icon[EntityMetaKey.Id].url}
						<IconComponent
							shape={IconShape.Circle}
							src={profile.$icon[EntityMetaKey.Id].url}
							alt=""
						/>
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

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			{#if profile.about}
				<div>
					<dt>Bio</dt>
					<dd>
						<ResourceBoundary
							resource={profile}
							placeholderText="Loading profile…"
						>
							{#snippet children(profile)}
								{profile.about}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if profile.nip05}
				<div>
					<dt>NIP-05</dt>
					<dd>
						<ResourceBoundary
							resource={profile}
							placeholderText="Loading profile…"
						>
							{#snippet children(profile)}
								{profile.nip05}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				{#if profile.$banner}
					{#if profile.$banner[EntityMetaKey.Id].url}
						<div>
							<dt>Banner</dt>
							<dd>
								<ResourceBoundary
									resource={profile}
									placeholderText="Loading profile…"
								>
									{#snippet children(profile)}
										<img
											src={profile.$banner[EntityMetaKey.Id].url}
											alt=""
										/>
									{/snippet}
								</ResourceBoundary>
							</dd>
						</div>
					{/if}
				{/if}
			{/if}

			{#if open}
				{#if profile.website}
					<div>
						<dt>Website</dt>
						<dd>
							<ResourceBoundary
								resource={profile}
								placeholderText="Loading profile…"
							>
								{#snippet children(profile)}
									<a
										href={profile.website}
										rel="noreferrer"
										target="_blank"
									>{profile.website}</a>
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}

				{#if profile.lud16}
					<div>
						<dt>Lightning address</dt>
						<dd>
							<ResourceBoundary
								resource={profile}
								placeholderText="Loading profile…"
							>
								{#snippet children(profile)}
									{profile.lud16}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}

				{#if profile.createdAt != null}
					<div>
						<dt>Created</dt>
						<dd>
							<ResourceBoundary
								resource={profile}
								placeholderText="Loading profile…"
							>
								{#snippet children(profile)}
									<Timestamp
										timestamp={profile.createdAt}
									/>
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/if}
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
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.NostrProfile,
								entityId,
								fieldName: '$$notes',
							}}
							href={resolve('/nostr/profile/[pubkey]/notes', {
								pubkey: entityId.pubkey,
							})}
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
							href={resolve('/nostr/profile/[pubkey]/articles', {
								pubkey: entityId.pubkey,
							})}
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
							href={resolve('/nostr/profile/[pubkey]/reposts', {
								pubkey: entityId.pubkey,
							})}
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


<style>
	.entity-view-detail-carousels :global(.collapsible-tabs-scroll[data-scroll-container]) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 36ch;
			}
		}
	}
</style>
