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
			primaryEvmAddress: {},
			followerCount: {},
			followingCount: {},
			$icon: {},
			$$verifiedAddresses: {},
			$$timestamps: {
				$: [
					Source.Neynar_Rest,
					Source.Snapchain_Rest,
				],
				$limit: 1,
			},
			$$casts: {},
		},
	)

	const casts = derive(
		farcasterUser,
		(farcasterUser) => (
			[...(farcasterUser.$$casts ?? [])].map((result) => ({
				result,
			}))
		),
	)


	// Components
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import Media from '$/components/Media.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'
	import FarcasterUser_TimestampsView from '$/views/FarcasterUser_TimestampsView.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterUser}
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={farcasterUser}
			placeholderText="Loading Farcaster profile (FID)…"
		>
			{#snippet children(farcasterUser)}
				{#if (
					farcasterUser.$icon
					&& farcasterUser.$icon[EntityMetaKey.Id].url
				)}
					<IconComponent
						shape={IconShape.Circle}
						src={farcasterUser.$icon[EntityMetaKey.Id].url}
						alt=""
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>
			FID {String(entityId.fid)}
		</span>
	{/snippet}

	{#snippet Title()}
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

	{#snippet TypeAnnotationTooltip()}
		<p>
			Farcaster profile keyed by FID: fname, display name, bio, and verified addresses from Neynar, Snapchain, or Farcaster client APIs.
		</p>
		<p>
			Casts on the profile are hub snapshots—not a complete archival export of every client.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={farcasterUser}
			placeholderText="Loading Farcaster profile (FID)…"
		>
			{#snippet children(farcasterUser)}
				{#if farcasterUser.bio != null && farcasterUser.bio !== ''}
					<p>
						<TruncatedValue
							value={farcasterUser.bio}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<dl data-column-item="center">
			<div>
				<dt>URL</dt>
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

			<ResourceBoundary
				resource={farcasterUser}
				placeholderText="Loading Farcaster profile (FID)…"
			>
				{#snippet children(farcasterUser)}
					<SocialMetricSnapshotRows
						metrics={[
							{
								label: 'Followers',
								value: farcasterUser.$$timestamps[0]?.followerCount ?? farcasterUser.followerCount,
							},
							{
								label: 'Following',
								value: farcasterUser.$$timestamps[0]?.followingCount ?? farcasterUser.followingCount,
							},
						]}
					/>
				{/snippet}
			</ResourceBoundary>

			{#if open}
				<div>
					<dt>Verified addresses</dt>
					<dd>
						<ResourceBoundary
							resource={farcasterUser}
							placeholderText="Loading Farcaster profile (FID)…"
						>
							{#snippet children(farcasterUser)}
								{#if farcasterUser.$$verifiedAddresses.length}
									<ul data-column="gap-2">
										{#each farcasterUser.$$verifiedAddresses as verification (stringify(verification[EntityMetaKey.Id]))}
											<li>
												{#if verification[EntityMetaKey.Id].protocol === 'ethereum'}
													<EvmAccountView
														entityId={{
															address: verification[EntityMetaKey.Id].address,
														}}
														href={resolve('/account/[address]', {
															address: verification[EntityMetaKey.Id].address,
														})}
														layout={EntityLayout.Title}
														open={false}
													/>
												{:else}
													<span data-text="mono muted">
														solana:{verification[EntityMetaKey.Id].address}
													</span>
												{/if}
											</li>
										{/each}
									</ul>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Username</dt>
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
					<dt>Icon</dt>
					<dd>
						<ResourceBoundary
							resource={farcasterUser}
							placeholderText="Loading Farcaster profile (FID)…"
						>
							{#snippet children(farcasterUser)}
								{#if (
									farcasterUser.$icon
									&& farcasterUser.$icon[EntityMetaKey.Id].url
								)}
									<Media
										media={{ url: farcasterUser.$icon[EntityMetaKey.Id].url }}
										alt={(farcasterUser.displayName ?? farcasterUser.username) ?? ''}
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
			<CollapsibleTabs
					id={`farcaster-user:${String(entityId.fid)}:carousel`}
					sectionIdPrefix={`farcaster-user:${String(entityId.fid)}`}
					sections={collapsibleTabsSections([
							{ id: 'record', label: 'Record' },
							{ id: 'overview', label: 'Profile' },
							{ id: 'casts', label: 'Casts' },
							{ id: 'metric-snapshots', label: 'Metrics' },
						])}
					data-card
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

				{#snippet SectionRecord()}
				{/snippet}

				{#snippet SectionOverview()}
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
				{/snippet}

					{#snippet SectionCasts()}
						<EntitiesList
						entityType={EntityType.FarcasterCast}
						href={resolve('/farcaster/feed')}
						id={`farcaster-user:${String(entityId.fid)}:casts-list`}
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

					{#snippet SectionMetricSnapshots()}
						<FarcasterUser_TimestampsView
							entityFieldReference={{
								entityType: EntityType.FarcasterUser,
								entityId,
								fieldName: '$$timestamps',
							}}
							href={href}
							id={`farcaster-user:${String(entityId.fid)}:metric-snapshots`}
							title="Metric snapshots"
						/>
					{/snippet}
			</CollapsibleTabs>
		{/snippet}
	</EntityView>
