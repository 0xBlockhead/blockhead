<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType._GlobalFarcasterNetwork>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType._GlobalFarcasterNetwork>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const globalFarcasterNetwork = $derived(selection({
		sources: [
			Source.Constants_Internal,
			Source.Farcaster_Rest,
			Source.Neynar_Rest,
			Source.Snapchain_Rest,
		],
	}))
	const titleFallback = $derived('global Farcaster network')
	const viewDomId = $derived('-global-farcaster-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import FarcasterFeedsView from '$/views/FarcasterFeedsView.svelte'
	import FarcasterUsersView from '$/views/FarcasterUsersView.svelte'
	import FarcasterChannelsView from '$/views/FarcasterChannelsView.svelte'
	import FarcasterCastsView from '$/views/FarcasterCastsView.svelte'
	import GlobalFarcasterNetwork_TimestampsView from '$/views/_GlobalFarcasterNetwork_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalFarcasterNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={globalFarcasterNetwork}>
			{#snippet Pending()}
				{title || 'global Farcaster network'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={globalFarcasterNetwork}>
			{#snippet Pending()}
				{[String((pendingEntity.scope) ?? '')].filter(Boolean).join(' ') || title || 'global Farcaster network'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.scope) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CollapsibleTabs
				id={viewDomId + '-carousel-farcaster-directory'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'farcaster-feeds',
							label: 'Feeds',
						},
						{
							id: 'farcaster-users',
							label: 'Users',
						},
						{
							id: 'farcaster-channels',
							label: 'Channels',
						},
					]
				}
				data-card
				class='network-view-collapsible-directory'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Directory</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionFarcasterFeeds({ id, label, open })}
					<FarcasterFeedsView
						selection={
							selection.$$observedFeeds({
								sources: [
									Source.Constants_Internal,
									Source.Farcaster_Rest,
								],
								count: true,
							})
						}
						href={resolve('/farcaster/feed')}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Farcaster feeds in this observed.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionFarcasterUsers({ id, label, open })}
					<FarcasterUsersView
						selection={
							selection.$$observedUsers({
								sources: [
									Source.Farcaster_Rest,
									Source.Neynar_Rest,
									Source.Snapchain_Rest,
								],
								count: true,
							})
						}
						href={resolve('/farcaster/users')}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Farcaster users in this observed.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionFarcasterChannels({ id, label, open })}
					<FarcasterChannelsView
						selection={
							selection.$$observedChannels({
								sources: [
									Source.Farcaster_Rest,
									Source.Neynar_Rest,
								],
								count: true,
							})
						}
						href={resolve('/farcaster/channels')}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Farcaster channels in this observed.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-farcaster-casts'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'farcaster-cast-list',
							label: 'Casts',
						},
					]
				}
				data-card
				class='network-view-collapsible-casts'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Casts</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionFarcasterCastList({ id, label, open })}
					<FarcasterCastsView
						selection={
							selection.$$observedCasts({
								count: true,
							})
						}
						href={resolve('/farcaster/feed/trending')}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Farcaster casts in this observed.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-farcaster-observations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'farcaster-hub-observations',
							label: 'Observations',
						},
					]
				}
				data-card
				class='network-view-collapsible-observations'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Observations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionFarcasterHubObservations({ id, label, open })}
					<GlobalFarcasterNetwork_TimestampsView
						selection={
							selection.$$timestamps({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Farcaster observed observations yet.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
