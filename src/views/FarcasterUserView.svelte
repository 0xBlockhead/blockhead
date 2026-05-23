<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.FarcasterUser>
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
			| 'Heading'
			| 'HeadingAfter'
			| 'Content'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	const farcasterUser = useEntity(
		EntityType.FarcasterUser,
		entityId,
		{
			$: [
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
				Source.Farcaster_Rest,
			],
			displayName: {},
			username: {},
			bio: {},
			url: {},
			verifiedAddress: {},
			$icon: {},
			$$casts: {},
		},
	)

	const casts = derive(
		farcasterUser,
		(farcasterUser) => (
			[...(farcasterUser.$$casts ?? [])]
				.toSorted((a, b) => (
					stringify(b[EntityMetaKey.Id]).localeCompare(stringify(a[EntityMetaKey.Id]))
				))
				.map((result) => ({
					result,
				}))
		),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import Media from '$/components/Media.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ActorView from '$/views/ActorView.svelte'
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterUser}
	{entityId}
	{href}
	bind:open
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={farcasterUser}
			placeholderText="Loading Farcaster profile (FID)…"
		>
			{#snippet children(farcasterUser)}
				{farcasterUser.displayName
					?? farcasterUser.username
					?? `FID ${String(entityId.fid)}`}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>
			FID {String(entityId.fid)}
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Icon()}
		<ResourceBoundary
			resource={farcasterUser}
			placeholderText="Loading Farcaster profile (FID)…"
		>
			{#snippet children(farcasterUser)}
				{#if farcasterUser.$icon}
					{#if farcasterUser.$icon[EntityMetaKey.Id].url}
						<IconComponent
							shape={IconShape.Circle}
							src={farcasterUser.$icon[EntityMetaKey.Id].url}
							alt=""
						/>
					{/if}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={farcasterUser}
			placeholderText="Loading Farcaster profile (FID)…"
		>
			{#snippet children(farcasterUser)}
				{#if (
					farcasterUser.username !== undefined
					&& farcasterUser.username !== (
						farcasterUser.displayName
						?? farcasterUser.username
						?? `FID ${String(entityId.fid)}`
					)
				)}
					<span data-text="muted">
						@{farcasterUser.username}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl data-column-item="center">
			<div>
				<dt>Bio</dt>
				<dd>
					<ResourceBoundary
						resource={farcasterUser}
						placeholderText="Loading Farcaster profile (FID)…"
					>
						{#snippet children(farcasterUser)}
							{#if farcasterUser.bio != null && farcasterUser.bio !== ''}
								{farcasterUser.bio}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>FID</dt>
				<dd>
					{entityId.fid}
				</dd>
			</div>

			<div>
				<dt>Link</dt>
				<dd>
					<ResourceBoundary
						resource={farcasterUser}
						placeholderText="Loading Farcaster profile (FID)…"
					>
						{#snippet children(farcasterUser)}
							{#if farcasterUser.url}
								<a
									href={farcasterUser.url}
									data-text="muted"
								>{farcasterUser.url}</a>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if open}
				<div>
					<dt>Verified address</dt>
					<dd>
						<ResourceBoundary
							resource={farcasterUser}
							placeholderText="Loading Farcaster profile (FID)…"
						>
							{#snippet children(farcasterUser)}
								{#if farcasterUser.verifiedAddress !== undefined}
									<ActorView
										entityId={{
											address: farcasterUser.verifiedAddress,
										}}
										href={resolve('/account/[address]', {
											address: farcasterUser.verifiedAddress,
										})}
										layout={EntityLayout.Title}
										open={false}
										showTypeAnnotation={false}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Name</dt>
					<dd>
						<ResourceBoundary
							resource={farcasterUser}
							placeholderText="Loading Farcaster profile (FID)…"
						>
							{#snippet children(farcasterUser)}
								{#if farcasterUser.displayName}
									{farcasterUser.displayName}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>fname (Farcaster username)</dt>
					<dd>
						<ResourceBoundary
							resource={farcasterUser}
							placeholderText="Loading Farcaster profile (FID)…"
						>
							{#snippet children(farcasterUser)}
								{#if farcasterUser.username}
									@{farcasterUser.username}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Avatar</dt>
					<dd>
						<ResourceBoundary
							resource={farcasterUser}
							placeholderText="Loading Farcaster profile (FID)…"
						>
							{#snippet children(farcasterUser)}
								{#if farcasterUser.$icon}
									{#if farcasterUser.$icon[EntityMetaKey.Id].url}
										<Media
											media={{ url: farcasterUser.$icon[EntityMetaKey.Id].url }}
											alt={(farcasterUser.displayName ?? farcasterUser.username) ?? ''}
										/>
									{/if}
								{/if}
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
		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`farcaster-user:${String(entityId.fid)}:carousel`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({
					open: _summaryOpen,
				})}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Profile
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({
					open: _markersOpen,
				})}
					<a
						data-scroll-marker-label="Record"
						href={`#farcaster-user:${String(entityId.fid)}:record`}
					>Record</a>
					<a
						data-scroll-marker-label="Profile"
						href={`#farcaster-user:${String(entityId.fid)}:overview`}
					>Profile</a>
					<a
						data-scroll-marker-label="Casts"
						href={`#farcaster-user:${String(entityId.fid)}:casts`}
					>Casts</a>
					{#if children}
						<a
							data-scroll-marker-label="More"
							href={`#farcaster-user:${String(entityId.fid)}:more`}
						>More</a>
					{/if}
				{/snippet}

				{#snippet body({ open: _paneOpen,
				})}
					<section
						data-scroll-marker-label="Record"
						id={`farcaster-user:${String(entityId.fid)}:record`}
					>
						<EntityDetails
							entityType={EntityType.FarcasterUser}
							{entityId}
						/>
					</section>
					<section
						data-scroll-marker-label="Profile"
						id={`farcaster-user:${String(entityId.fid)}:overview`}
					>
						<ResourceBoundary
							resource={farcasterUser}
							placeholderText="Loading Farcaster profile (FID)…"
						>
							{#snippet children(farcasterUser)}
								<section data-column>
									<h3>Farcaster profile</h3>
								</section>
							{/snippet}
						</ResourceBoundary>
					</section>
					<section
						data-scroll-marker-label="Casts"
						id={`farcaster-user:${String(entityId.fid)}:casts`}
					>
						<EntitiesList
							entityType={EntityType.FarcasterCast}
							href={resolve('/farcaster/feed')}
							id={`farcaster-user:${String(entityId.fid)}:casts-list`}
							placeholderKeys={new SvelteSet()}
							placeholderText="Loading casts (Farcaster FID + cast hash)…"
							resource={casts}
							title="Casts"
							getKey={(row) => stringify(row.result[EntityMetaKey.Id])}
						>
							{#snippet Empty()}
								<p data-text="muted">
									No casts yet.
								</p>
							{/snippet}

							{#snippet Item(props)}
								{#if props.item}
									{@const castId = props.item.result[EntityMetaKey.Id]}
									<FarcasterCastView
										entityId={{
											fid: castId.fid,
											hash: castId.hash,
										}}
										href={resolve('/(social)/(farcaster)/farcaster/(feed)/cast/[fid]/[hash]', {
											fid: String(castId.fid),
											hash: String(castId.hash),
										})}
										layout={EntityLayout.Summary}
										variant="feed"
									/>
								{/if}
							{/snippet}
						</EntitiesList>
					</section>
					{#if children}
						<section
							data-scroll-marker-label="More"
							id={`farcaster-user:${String(entityId.fid)}:more`}
						>
							{@render children()}
						</section>
					{/if}
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>

