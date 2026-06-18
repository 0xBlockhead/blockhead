<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
			userId: String(selector.fid),
		}),
		open = $bindable(true),
			...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.FarcasterUser>
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

	const farcasterUserResource = $derived(
		select(EntityType.FarcasterUser,
			selector,
			({ sources: [
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
				Source.Farcaster_Rest,
			], fields: { displayName: true, username: true, bio: true, url: true, $primaryEvmAccount: true, $icon: true, $$verifiedAddresses: true, $$timestamps: ({ sources: [
					Source.Neynar_Rest,
					Source.Snapchain_Rest,
				], limit: 1 }) } }),
		)
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
	entitySelector={selector}
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
					&& farcasterUser.fields.$icon[EntityMetaKey.Selector].url
				)}
					<IconComponent
						shape={IconShape.Circle}
						src={farcasterUser.fields.$icon[EntityMetaKey.Selector].url}
						alt=""
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>
			FID {String(selector.fid)}
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
					?? `FID ${String(selector.fid)}`}
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
						?? `FID ${String(selector.fid)}`
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
									selector={{
										url: farcasterUser.fields.url,
									}}
									layout={EntityLayout.Title}

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
								value: farcasterUser.fields.$$timestamps.values.at(0)?.followerCount,
							},
							{
								label: 'Following',
								value: farcasterUser.fields.$$timestamps.values.at(0)?.followingCount,
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
									selector={farcasterUser.fields.$primaryEvmAccount[EntityMetaKey.Selector]}
									href={resolve('/account/[address]', {
										address: farcasterUser.fields.$primaryEvmAccount[EntityMetaKey.Selector].address,
									})}
									layout={EntityLayout.Title}

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
									{#if farcasterUser.fields.$$verifiedAddresses.values.length}
										<ul data-column="gap-2">
											{#each farcasterUser.fields.$$verifiedAddresses.values as verification (stringify(verification[EntityMetaKey.Selector]))}
												<li>
													{#if verification.$evmAccount}
														<EvmAccountView
															selector={verification.$evmAccount[EntityMetaKey.Selector]}
															href={resolve('/account/[address]', {
																address: verification.$evmAccount[EntityMetaKey.Selector].address,
															})}
															layout={EntityLayout.Title}

														/>
													{:else if verification.$solanaAccount}
														<SolanaAccountView
															selector={verification.$solanaAccount[EntityMetaKey.Selector]}
															layout={EntityLayout.Title}

														/>
													{:else}
														<span data-text="mono muted">
															{verification[EntityMetaKey.Selector].protocol}:{verification[EntityMetaKey.Selector].address}
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
			id={`farcaster-user:${String(selector.fid)}:carousel`}
			sectionIdPrefix={`farcaster-user:${String(selector.fid)}`}
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
					id={`farcaster-user:${String(selector.fid)}:casts-farcasterUsers`}
					title="Casts"
					bind:open
					collapsible={false}
				>
					{#snippet body()}
						{#if open}
							{@const casts = select(EntityType.FarcasterUser,
								selector,
							).$$casts}
							<ResourceBoundary resource={casts} placeholderText="Loading casts (Farcaster FID + cast hash)…">
								{#snippet children(casts)}
									<EntitiesList
										collapsible={false}
										showSummary={false}
										entityType={EntityType.FarcasterCast}
										href={resolve('/farcaster/feed')}
										id={`farcaster-user:${String(selector.fid)}:casts-farcasterUsers-items`}
										placeholderText="Loading casts (Farcaster FID + cast hash)…"
										items={casts.entities}
										title="Casts"
										getKey={(cast) => stringify(cast.entitySelector)}
										getSortValue={(cast) => (
											[...stringify(cast.entitySelector)].map((character) => (
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
											<FarcasterCastView
												selector={item.entitySelector}
												layout={EntityLayout.Summary}
												variant="feed"
											/>
										{/snippet}
									</EntitiesList>
								{/snippet}
							</ResourceBoundary>
						{/if}
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionMetricSnapshots()}
				<FarcasterUser_TimestampsView
					selection={select(
			EntityType.FarcasterUser,
			selector
		).$$timestamps}
					href={href}
					id={`farcaster-user:${String(selector.fid)}:metric-snapshots`}
					title="Metric snapshots"
				/>
			{/snippet}
			</CollapsibleTabs>
		{/snippet}
	</EntityView>
