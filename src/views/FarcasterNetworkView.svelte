<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.FarcasterNetwork> = $props()

	const farcasterNetwork = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
		fields: {
			protocolName: true,
			homeUrl: true,
			docsUrl: true,
			registryName: true,
			relationshipModel: true,
		},
	}))
	const titleFallback = $derived((prefetched.protocolName ?? '') || 'Farcaster')
	const viewDomId = $derived('farcaster-network-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FarcasterFeedsView from '$/views/FarcasterFeedsView.svelte'
	import FarcasterUsersView from '$/views/FarcasterUsersView.svelte'
	import FarcasterChannelsView from '$/views/FarcasterChannelsView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterNetwork}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve('/(social)/(farcaster)/farcaster')
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={farcasterNetwork}>
			{#snippet children(entity)}
				{entity.protocolName || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		Farcaster
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Protocol</dt>
				<dd>
					<ResourceBoundary
						resource={farcasterNetwork}
					>
						{#snippet children(entity)}
							{entity.protocolName}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Home URL</dt>
				<dd>
					<ResourceBoundary
						resource={farcasterNetwork}
					>
						{#snippet children(entity)}
							<a
								href={entity.homeUrl}
								target="_blank"
								rel="noreferrer noopener"
							>
								<TruncatedValue value={entity.homeUrl} />
							</a>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={farcasterNetwork}
			>
				{#snippet children(entity)}
					{@const docsUrl = entity.docsUrl}
					{#if docsUrl != null}
						<div>
							<dt>Docs URL</dt>
							<dd>
								<a
									href={docsUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={docsUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={farcasterNetwork}
			>
				{#snippet children(entity)}
					{@const registryName = entity.registryName}
					{#if registryName != null}
						<div>
							<dt>Registry name</dt>
							<dd>
								{registryName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={farcasterNetwork}
			>
				{#snippet children(entity)}
					{@const relationshipModel = entity.relationshipModel}
					{#if relationshipModel != null}
						<div>
							<dt>Connection model</dt>
							<dd>
								{relationshipModel}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-farcaster-network-directory'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'farcaster-network-feeds',
						label: 'Feeds',
					},
					{
						id: 'farcaster-network-users',
						label: 'Users',
					},
					{
						id: 'farcaster-network-channels',
						label: 'Channels',
					},
				]
			}
			data-card
			class='network-view-collapsible-directory'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Directory</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionFarcasterNetworkFeeds({ id, label })}
				<FarcasterFeedsView
					selection={selection.$$feeds}
					href={resolve('/(social)/(farcaster)/farcaster/(farcasterNetwork)/feed')}
					collapsible={false}
					title={label}
					emptyText='No Farcaster feeds in this observed.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionFarcasterNetworkUsers({ id, label })}
				<FarcasterUsersView
					selection={selection.$$users}
					href={resolve('/(social)/(farcaster)/farcaster/(farcasterNetwork)/users')}
					collapsible={false}
					title={label}
					emptyText='No Farcaster users in this observed.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionFarcasterNetworkChannels({ id, label })}
				<FarcasterChannelsView
					selection={selection.$$channels}
					href={resolve('/(social)/(farcaster)/farcaster/(farcasterNetwork)/channels')}
					collapsible={false}
					title={label}
					emptyText='No Farcaster channels in this observed.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
