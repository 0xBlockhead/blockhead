<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.FarcasterUser> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Snapchain_Rest,
		],
	}))
	const farcasterUser = $derived(viewSelection({
		fields: {
			displayName: true,
			username: true,
		},
	}))
	const titleFallback = $derived([(prefetched.displayName ?? ''), (prefetched.username ?? ''), String(selection.entitySelector.fid)].filter(Boolean).join(' ') || 'Farcaster user')
	const viewDomId = $derived('farcaster-user-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import FarcasterCastsView from '$/views/FarcasterCastsView.svelte'
	import FarcasterVerifiedAddressesView from '$/views/FarcasterVerifiedAddressesView.svelte'
	import FarcasterUser_TimestampsView from '$/views/FarcasterUser_TimestampsView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterUser}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(social)/(farcaster)/farcaster/(farcasterNetwork)/user/[userId=farcasterFid]',
				{
					userId: String(selection.entitySelector.fid),
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
		<ResourceBoundary resource={farcasterUser}>
			{#snippet children(entity)}
				{@const reference = entity.$icon}
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
		<ResourceBoundary resource={farcasterUser}>
			{#snippet children(entity)}
				{[(entity.displayName ?? ''), (entity.username ?? ''), String(selection.entitySelector.fid)].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{['FID ', String(selection.entitySelector.fid)].filter(Boolean).join(' ') || [(prefetched.displayName ?? ''), (prefetched.username ?? ''), String(selection.entitySelector.fid)].filter(Boolean).join(' ') || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={farcasterUser}>
			{#snippet children(entity)}
				{@const username = entity.username}
				{#if username != null}
					<span data-text="muted">
						<span>@</span>
						{username}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>FID</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.fid}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={farcasterUser}
			>
				{#snippet children(entity)}
					{@const username = entity.username}
					{#if username != null}
						<div>
							<dt>Username</dt>
							<dd>
								<span>@</span>
								{username}
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
							url: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const url = entity.url}
					{#if url != null}
						<div>
							<dt>URL</dt>
							<dd>
								<a
									href={url}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={url} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$primaryEvmAccount}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>Primary EVM account</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary
			resource={
				viewSelection({
					fields: {
						bio: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const bio = entity.bio}
				{#if bio != null && bio !== ''}
					<p data-text="long-text">{bio}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-farcaster-user-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'farcaster-user-casts',
						label: 'Casts',
					},
					{
						id: 'farcaster-user-verified-addresses',
						label: 'Verified addresses',
					},
				]
			}
			data-card
			class='network-view-collapsible-activity'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionFarcasterUserCasts({ id, label })}
				<FarcasterCastsView
					selection={selection.$$casts}
					href={
						resolve(
							'/(social)/(farcaster)/farcaster/(farcasterNetwork)/user/[userId=farcasterFid]/(farcasterUser)/casts',
							{
								userId: String(selection.entitySelector.fid),
							}
						)
					}
					collapsible={false}
					title={label}
					emptyText='No Farcaster casts for this user.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionFarcasterUserVerifiedAddresses({ id, label })}
				<FarcasterVerifiedAddressesView
					selection={selection.$$verifiedAddresses}
					collapsible={false}
					title={label}
					emptyText='No Farcaster verified addresses for this user.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-farcaster-user-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'farcaster-user-timestamps',
						label: 'Observations',
					},
				]
			}
			data-card
			class='network-view-collapsible-observations'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionFarcasterUserTimestamps({ id, label })}
				<FarcasterUser_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No Farcaster user observations yet.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
