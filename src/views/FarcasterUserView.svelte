<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
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

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'

	const farcasterUserResource = subscribe(EntityType.FarcasterUser,
		entityId,
		({ sources: [
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
				Source.Farcaster_Rest,
			], fields: { displayName: true, username: true, bio: true, url: true, $primaryEvmAccount: true, followerCount: true, followingCount: true, $icon: true, $$verifiedAddresses: true, $$timestamps: ({ sources: [
					Source.Neynar_Rest,
					Source.Snapchain_Rest,
				], limit: 1 }) } }),
	)


	// Components
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import FarcasterCastView from '$/views/FarcasterCastView.svelte'
	import FarcasterUser_TimestampsView from '$/views/FarcasterUser_TimestampsView.svelte'
	import SolanaAccountView from '$/views/SolanaAccountView.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
	import UrlView from '$/views/UrlView.svelte'
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
			resource={farcasterUserResource}
			placeholderText="Loading Farcaster profile (FID)…"
		>
			{#snippet children(farcasterUser)}
				{#if (
					farcasterUser.fields.$icon
					&& farcasterUser.fields.$icon[EntityMetaKey.Id].url
				)}
					<IconComponent
						shape={IconShape.Circle}
						src={farcasterUser.fields.$icon[EntityMetaKey.Id].url}
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
			resource={farcasterUserResource}
			placeholderText="Loading Farcaster profile (FID)…"
		>
			{#snippet children(farcasterUser)}
				{farcasterUser.fields.displayName
					?? farcasterUser.fields.username
					?? `FID ${String(entityId.fid)}`}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={farcasterUserResource}
			placeholderText="Loading Farcaster profile (FID)…"
		>
			{#snippet children(farcasterUser)}
				{#if (
					farcasterUser.fields.username !== undefined
					&& farcasterUser.fields.username !== (
						farcasterUser.fields.displayName
						?? farcasterUser.fields.username
						?? `FID ${String(entityId.fid)}`
					)
				)}
					<span data-text="muted">
						@{farcasterUser.fields.username}
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

	{#snippet Content({})}
		<ResourceBoundary
			resource={farcasterUserResource}
			placeholderText="Loading Farcaster profile (FID)…"
		>
			{#snippet children(farcasterUser)}
				{#if farcasterUser.fields.bio != null && farcasterUser.fields.bio !== ''}
					<p>
						<TruncatedValue
							value={farcasterUser.fields.bio}
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
						resource={farcasterUserResource}
						placeholderText="Loading Farcaster profile (FID)…"
					>
						{#snippet children(farcasterUser)}
							{#if farcasterUser.fields.url}
								<UrlView
									entityId={{
										url: farcasterUser.fields.url,
									}}
									layout={EntityLayout.Title}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={farcasterUserResource}
				placeholderText="Loading Farcaster profile (FID)…"
			>
				{#snippet children(farcasterUser)}
					<SocialMetricSnapshotRows
						metrics={[
							{
								label: 'Followers',
								value: farcasterUser.fields.$$timestamps[0]?.followerCount ?? farcasterUser.fields.followerCount,
							},
							{
								label: 'Following',
								value: farcasterUser.fields.$$timestamps[0]?.followingCount ?? farcasterUser.fields.followingCount,
							},
						]}
					/>
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={farcasterUserResource}
				placeholderText="Loading Farcaster profile (FID)…"
			>
				{#snippet children(farcasterUser)}
					{#if farcasterUser.fields.$primaryEvmAccount != null}
						<div>
							<dt>Primary EVM account</dt>
							<dd>
								<EvmAccountView
									entityId={farcasterUser.fields.$primaryEvmAccount[EntityMetaKey.Id]}
									href={resolve('/account/[address]', {
										address: farcasterUser.fields.$primaryEvmAccount[EntityMetaKey.Id].address,
									})}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			{#if open}
				<div>
					<dt>Verified addresses</dt>
					<dd>
						<ResourceBoundary
							resource={farcasterUserResource}
							placeholderText="Loading Farcaster profile (FID)…"
						>
							{#snippet children(farcasterUser)}
									{#if farcasterUser.fields.$$verifiedAddresses?.values.length}
										<ul data-column="gap-2">
											{#each farcasterUser.fields.$$verifiedAddresses.values as verification (stringify(verification[EntityMetaKey.Id]))}
												<li>
													{#if verification.$evmAccount}
														<EvmAccountView
															entityId={verification.$evmAccount[EntityMetaKey.Id]}
															href={resolve('/account/[address]', {
																address: verification.$evmAccount[EntityMetaKey.Id].address,
															})}
															layout={EntityLayout.Title}
															open={false}
														/>
													{:else if verification.$solanaAccount}
														<SolanaAccountView
															entityId={verification.$solanaAccount[EntityMetaKey.Id]}
															layout={EntityLayout.Title}
															open={false}
														/>
													{:else}
														<span data-text="mono muted">
															{verification[EntityMetaKey.Id].protocol}:{verification[EntityMetaKey.Id].address}
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
							resource={farcasterUserResource}
							placeholderText="Loading Farcaster profile (FID)…"
						>
							{#snippet children(farcasterUser)}
								{#if farcasterUser.fields.username}
									@{farcasterUser.fields.username}
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

			{#snippet SectionOverview()}
				<ResourceBoundary
					resource={farcasterUserResource}
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
					id={`farcaster-user:${String(entityId.fid)}:casts-farcasterUsers`}
					title="Casts"
					bind:open
					collapsible={false}
				>
					{#snippet body()}
						{#if open}
							{@const farcasterUserCasts = subscribe(EntityType.FarcasterUser,
								entityId,
								({ fields: { $$casts: true } }),
							)}
							{@const casts = derive(
								farcasterUserCasts,
								(farcasterUserCasts) => (
									[...(farcasterUserCasts.$$casts ?? [])].map((result) => ({
										result,
									}))
								),
							)}
							<EntitiesList
								collapsible={false}
								showSummary={false}
								entityType={EntityType.FarcasterCast}
								href={resolve('/farcaster/feed')}
								id={`farcaster-user:${String(entityId.fid)}:casts-farcasterUsers-items`}
								placeholderText="Loading casts (Farcaster FID + cast hash)…"
								resource={casts}
								title="Casts"
								getKey={(row) => stringify(row.result[EntityMetaKey.Id])}
								getSortValue={(row) => (
									[...stringify(row.result[EntityMetaKey.Id])].map((character) => (
										String.fromCharCode(0xffff - character.charCodeAt(0))
									)).join('')
								)}
								open={true}
							>
								{#snippet Empty()}
									<p data-text="muted">
										No casts yet.
									</p>
								{/snippet}

								{#snippet Item({ item })}
									{@const castId = item.result[EntityMetaKey.Id]}
									<FarcasterCastView
										entityId={castId}
										layout={EntityLayout.Summary}
										variant="feed"
									/>
								{/snippet}
							</EntitiesList>
						{/if}
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
