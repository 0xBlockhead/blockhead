<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
			userId: String(entityId.fid),
		}),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.FarcasterUser>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'CollapsibleProps'
			| 'idDragPlainText'
			| 'layout'
			| 'ontoggle'
			| 'showTypeAnnotation'
			| 'Title'
			| 'TypeAnnotationTooltip'
			| 'Value'
		>
	> = $props()


	// State
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

	const casts = derive(farcasterUser, (loadedFarcasterUser) => (
			[...(farcasterUser.$$casts ?? [])].map((result) => ({
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
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={farcasterUser}
			placeholderText="Loading Farcaster profile (FID)…"
		>
			{#snippet children(loadedFarcasterUser)}
				{loadedFarcasterUser.displayName
					?? loadedFarcasterUser.username
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

	{#snippet TypeAnnotationTooltip()}
		<p>
			Farcaster profile keyed by FID: fname, display name, bio, and verified addresses from Neynar or Snapchain.
		</p>
		<p>
			Casts on the profile are hub snapshots—not a complete archival export of every client.
		</p>
	{/snippet}

	{#snippet Icon()}
		<ResourceBoundary
			resource={farcasterUser}
			placeholderText="Loading Farcaster profile (FID)…"
		>
			{#snippet children(loadedFarcasterUser)}
				{#if (
					farcasterUser.$icon
					&& farcasterUser.$icon[EntityMetaKey.Id].url
				)}
					<IconComponent
						shape={IconShape.Circle}
						src={loadedFarcasterUser.$icon[EntityMetaKey.Id].url}
						alt=""
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={farcasterUser}
			placeholderText="Loading Farcaster profile (FID)…"
		>
			{#snippet children(loadedFarcasterUser)}
				{#if (
					farcasterUser.username !== undefined
					&& farcasterUser.username !== (
						farcasterUser.displayName
						?? loadedFarcasterUser.username
						?? `FID ${String(entityId.fid)}`
					)
				)}
					<span data-text="muted">
						@{loadedFarcasterUser.username}
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
						{#snippet children(loadedFarcasterUser)}
							{#if loadedFarcasterUser.bio != null && loadedFarcasterUser.bio !== ''}
								{loadedFarcasterUser.bio}
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
						{#snippet children(loadedFarcasterUser)}
							{#if loadedFarcasterUser.url}
								<a
									href={loadedFarcasterUser.url}
									data-text="muted"
								>{loadedFarcasterUser.url}</a>
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
							{#snippet children(loadedFarcasterUser)}
								{#if loadedFarcasterUser.verifiedAddress !== undefined}
									<ActorView
										entityId={{
											address: loadedFarcasterUser.verifiedAddress,
										}}
										href={resolve('/account/[address]', {
											address: loadedFarcasterUser.verifiedAddress,
										})}
										layout={EntityLayout.Title}
										open={false}
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
							{#snippet children(loadedFarcasterUser)}
								{#if loadedFarcasterUser.displayName}
									{loadedFarcasterUser.displayName}
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
							{#snippet children(loadedFarcasterUser)}
								{#if loadedFarcasterUser.username}
									@{loadedFarcasterUser.username}
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
							{#snippet children(loadedFarcasterUser)}
								{#if (
									farcasterUser.$icon
									&& farcasterUser.$icon[EntityMetaKey.Id].url
								)}
									<Media
										media={{ url: loadedFarcasterUser.$icon[EntityMetaKey.Id].url }}
										alt={(farcasterUser.displayName ?? loadedFarcasterUser.username) ?? ''}
									/>
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
				sectionIdPrefix={`farcaster-user:${String(entityId.fid)}`}
				sections={[
					{ id: 'record', label: 'Record' },
					{ id: 'overview', label: 'Profile' },
					{ id: 'casts', label: 'Casts' },
				]}
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

				{#snippet SectionRecord({ id, label })}
					<EntityDetails
						entityType={EntityType.FarcasterUser}
						{entityId}
					/>
				{/snippet}

				{#snippet SectionOverview({ id, label })}
					<ResourceBoundary
						resource={farcasterUser}
						placeholderText="Loading Farcaster profile (FID)…"
					>
						{#snippet children(loadedFarcasterUser)}
							<section data-column>
								<h3>Farcaster profile</h3>
							</section>
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet SectionCasts({ id, label })}
					<EntitiesList
						entityType={EntityType.FarcasterCast}
						href={resolve('/farcaster/feed')}
						id={`${id}-list`}
						placeholderText="Loading casts (Farcaster FID + cast hash)…"
						resource={casts}
						title="Casts"
						getKey={(row) => stringify(row.result[EntityMetaKey.Id])}
						getSortValue={(row) => (
							[...stringify(row.result[EntityMetaKey.Id])].map((character) => (
								String.fromCharCode(0xffff - character.charCodeAt(0))
							)).join('')
						)}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No casts yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							{@const castId = item.result[EntityMetaKey.Id]}
							<FarcasterCastView
								entityId={{
									fid: castId.fid,
									hash: castId.hash,
								}}
								layout={EntityLayout.Summary}
								variant="feed"
							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>


