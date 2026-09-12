<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.SnapshotSpace> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.SnapshotHub_Graphql,
		],
	}))
	const snapshotSpace = $derived(viewSelection({
		fields: {
			name: true,
			symbol: true,
			proposalsCount: true,
		},
	}))
	const titleFallback = $derived((prefetched.name ?? '') || selection.entitySelector.spaceId || 'Snapshot space')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmNetworkAccountsView from '$/views/EvmNetworkAccountsView.svelte'
	import SnapshotProposalsView from '$/views/SnapshotProposalsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.SnapshotSpace}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/~/snapshot/space/[spaceId=stringSegment]',
				{
					spaceId: encodeURIComponent(selection.entitySelector.spaceId),
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
		<ResourceBoundary resource={snapshotSpace}>
			{#snippet children(entity)}
				{@const reference = entity.$avatar}
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
		<ResourceBoundary resource={snapshotSpace}>
			{#snippet children(entity)}
				{(entity.name ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={snapshotSpace}>
			{#snippet children(entity)}
				{[(entity.symbol ?? ''), String(entity.proposalsCount ?? '')].filter(Boolean).join(' ') || (entity.name ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$network}
		>
			{#snippet children(network)}
				{#if network != null}
					{@const networkInitial = untrack(() => network)}
					<span data-text="muted">
						<NetworkView
							selection={select(EntityType.Network, (network ?? networkInitial)[EntityMetaKey.Selector])}
							prefetched={network ?? networkInitial}
							layout={EntityLayout.Title}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Space ID</dt>
				<dd>
					{selection.entitySelector.spaceId}
				</dd>
			</div>

			<ResourceBoundary
				resource={snapshotSpace}
			>
				{#snippet children(entity)}
					{@const name = entity.name}
					{#if name != null}
						<div>
							<dt>Name</dt>
							<dd>
								{name}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={snapshotSpace}
			>
				{#snippet children(entity)}
					{@const symbol = entity.symbol}
					{#if symbol != null}
						<div>
							<dt>Symbol</dt>
							<dd>
								{symbol}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$network}
			>
				{#snippet children(network)}
					{#if network != null}
						{@const networkInitial = untrack(() => network)}
						<div>
							<dt>Network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, (network ?? networkInitial)[EntityMetaKey.Selector])}
									prefetched={network ?? networkInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={snapshotSpace}
			>
				{#snippet children(entity)}
					{@const proposalsCount = entity.proposalsCount}
					{#if proposalsCount != null}
						<div>
							<dt>Proposals</dt>
							<dd>
								{proposalsCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							votesCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const votesCount = entity.votesCount}
					{#if votesCount != null}
						<div>
							<dt>Votes</dt>
							<dd>
								{votesCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							followersCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const followersCount = entity.followersCount}
					{#if followersCount != null}
						<div>
							<dt>Followers</dt>
							<dd>
								{followersCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							createdAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const createdAtMs = entity.createdAtMs}
					{#if createdAtMs != null}
						<div>
							<dt>Created</dt>
							<dd>
								{createdAtMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							cover: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const cover = entity.cover}
					{#if cover != null}
						<div>
							<dt>Cover</dt>
							<dd>
								{cover}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							website: true,
						},
					})
				}
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
				resource={
					viewSelection({
						fields: {
							twitter: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const twitter = entity.twitter}
					{#if twitter != null}
						<div>
							<dt>Twitter</dt>
							<dd>
								{twitter}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							github: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const github = entity.github}
					{#if github != null}
						<div>
							<dt>GitHub</dt>
							<dd>
								{github}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							farcaster: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const farcaster = entity.farcaster}
					{#if farcaster != null}
						<div>
							<dt>Farcaster</dt>
							<dd>
								{farcaster}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							coingecko: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const coingecko = entity.coingecko}
					{#if coingecko != null}
						<div>
							<dt>CoinGecko</dt>
							<dd>
								{coingecko}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							discussions: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const discussions = entity.discussions}
					{#if discussions != null}
						<div>
							<dt>Discussions</dt>
							<dd>
								<a
									href={discussions}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={discussions} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							terms: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const terms = entity.terms}
					{#if terms != null}
						<div>
							<dt>Terms</dt>
							<dd>
								<a
									href={terms}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={terms} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							location: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const location = entity.location}
					{#if location != null}
						<div>
							<dt>Location</dt>
							<dd>
								{location}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							domain: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const domain = entity.domain}
					{#if domain != null}
						<div>
							<dt>Domain</dt>
							<dd>
								{domain}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							private: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const privateValue = entity.private}
					{#if privateValue != null}
						<div>
							<dt>Private</dt>
							<dd>
								{privateValue ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							categories: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const categories = entity.categories}
					{#if categories != null}
						<div>
							<dt>Categories</dt>
							<dd>
								{categories.join(', ')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							strategies: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const strategies = entity.strategies}
					{#if strategies != null}
						<div>
							<dt>Strategies</dt>
							<dd>
								{JSON.stringify(strategies)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							delegationType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const delegationType = entity.delegationType}
					{#if delegationType != null}
						<div>
							<dt>Delegation type</dt>
							<dd>
								{delegationType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							delegationContract: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const delegationContract = entity.delegationContract}
					{#if delegationContract != null}
						<div>
							<dt>Delegation contract</dt>
							<dd>
								{delegationContract}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							delegationNetwork: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const delegationNetwork = entity.delegationNetwork}
					{#if delegationNetwork != null}
						<div>
							<dt>Delegation network</dt>
							<dd>
								{delegationNetwork}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							delegationApi: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const delegationApi = entity.delegationApi}
					{#if delegationApi != null}
						<div>
							<dt>Delegation API</dt>
							<dd>
								<a
									href={delegationApi}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={delegationApi} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							treasuries: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const treasuries = entity.treasuries}
					{#if treasuries != null}
						<div>
							<dt>Treasuries</dt>
							<dd>
								{JSON.stringify(treasuries)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			{#if contentOpen}
				<ResourceBoundary
					resource={
						viewSelection({
							fields: {
								about: true,
							},
						})
					}
				>
					{#snippet children(entity)}
						{@const about = entity.about}
						{#if about != null}
							<div>
								<dt>About</dt>
								<dd>
									<span data-text="long-text">{about}</span>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const adminsResource = selection.$$admins}
		<ResourceBoundary
			resource={adminsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EvmNetworkAccountsView
						selection={adminsResource}
						countResource={adminsResource.count}
						title='Admins'
						id='admins'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const membersResource = selection.$$members}
		<ResourceBoundary
			resource={membersResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EvmNetworkAccountsView
						selection={membersResource}
						countResource={membersResource.count}
						title='Members'
						id='members'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const moderatorsResource = selection.$$moderators}
		<ResourceBoundary
			resource={moderatorsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EvmNetworkAccountsView
						selection={moderatorsResource}
						countResource={moderatorsResource.count}
						title='Moderators'
						id='moderators'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const proposalsResource = selection.$$proposals}
		<ResourceBoundary
			resource={proposalsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<SnapshotProposalsView
						selection={proposalsResource}
						countResource={proposalsResource.count}
						title='Proposals'
						href={
							resolve(
								'/~/snapshot/space/[spaceId=stringSegment]/(snapshotSpace)/proposals',
								{
									spaceId: encodeURIComponent(selection.entitySelector.spaceId),
								}
							)
						}
						id='proposals'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
