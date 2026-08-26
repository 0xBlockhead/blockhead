<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
	}: EntitySelectionViewProps<EntityType.FarcasterChannel> = $props()

	const farcasterChannelLatestResource1 = $derived(
		selection
			.$$timestamps({
				sources: [
					Source.Farcaster_Rest,
					Source.Neynar_Rest,
				],
				fields: {
					name: true,
					description: true,
					iconUrl: true,
					$icon: true,
					headerImageUrl: true,
					$headerImage: true,
					$moderator: true,
					$$moderators: true,
					pinnedCastHash: true,
					publicCasting: true,
					externalLinkTitle: true,
					externalLinkUrl: true,
					followerCount: true,
					memberCount: true,
					timestampMs: true,
					source: true,
				},
				limit: 1,
				orderBy: [
					[({ fieldRow }) => fieldRow[EntityMetaKey.Value][EntityMetaKey.Selector].timestampMs ?? Number.NEGATIVE_INFINITY, 'desc'],
				],
			})
	)

	const farcasterChannel = $derived(selection({
		sources: selection.sources ?? [
			Source.Farcaster_Rest,
			Source.Neynar_Rest,
		],
		fields: {
			id: true,
			parentUrl: true,
			createdAt: true,
		},
	}))
	const titleFallback = $derived((prefetched.id ?? '') || 'Farcaster channel')
	const viewDomId = $derived('farcaster-channel-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
	import FarcasterChannel_TimestampView from '$/views/FarcasterChannel_TimestampView.svelte'
	import FarcasterCastsView from '$/views/FarcasterCastsView.svelte'
	import FarcasterChannel_TimestampsView from '$/views/FarcasterChannel_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterChannel}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				'id' in selection.entitySelector ?
					resolve(
						'/(social)/(farcaster)/farcaster/(farcasterNetwork)/channel/[channelId=stringSegment]',
						{
							channelId: selection.entitySelector.id,
						}
					)
				:
					'parentUrl' in selection.entitySelector ?
						resolve(
							'/farcaster/channel/parent/[parentUrl=stringSegment]',
							{
								parentUrl: selection.entitySelector.parentUrl,
							}
						)
					:
						undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={farcasterChannel}>
			{#snippet children(entity)}
				{entity.id || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={farcasterChannel}>
			{#snippet children(entity)}
				<TruncatedValue value={entity.parentUrl} />
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={farcasterChannel}>
			{#snippet children(entity)}
				{@const createdAt = entity.createdAt}
				{#if createdAt != null}
					<span data-text="muted">
						<Timestamp timestamp={createdAt} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Latest observation</dt>
				<dd>
					<ResourceBoundary
						resource={farcasterChannelLatestResource1}
					>
						{#snippet children(farcasterChannelTimestamps)}
							{@const farcasterChannelTimestamp = farcasterChannelTimestamps.values[0]}
							{#if farcasterChannelTimestamp != null}
								{@const farcasterChannelTimestampSelector = farcasterChannelTimestamp[EntityMetaKey.Selector]}
								<FarcasterChannel_TimestampView
									selection={
										select(EntityType.FarcasterChannel_Timestamp, farcasterChannelTimestampSelector, {
											sources: [
												Source.Farcaster_Rest,
												Source.Neynar_Rest,
											],
										})
									}
									prefetched={{ ...farcasterChannelTimestampSelector, ...farcasterChannelTimestamp }}
									layout={EntityLayout.Value}
								/>
							{:else}
								<p data-text="muted" data-section-state="resolved-empty">No latest observation available.</p>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					<ResourceBoundary
						resource={farcasterChannel}
					>
						{#snippet children(entity)}
							{entity.id}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Parent URL</dt>
				<dd>
					<ResourceBoundary
						resource={farcasterChannel}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.parentUrl} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$lead}
			>
				{#snippet children(farcasterUser)}
					{#if farcasterUser != null}
						{@const farcasterUserInitial = untrack(() => farcasterUser)}
						<div>
							<dt>Lead</dt>
							<dd>
								<FarcasterUserView
									selection={select(EntityType.FarcasterUser, (farcasterUser ?? farcasterUserInitial)[EntityMetaKey.Selector])}
									prefetched={farcasterUser ?? farcasterUserInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={farcasterChannel}
			>
				{#snippet children(entity)}
					{@const createdAt = entity.createdAt}
					{#if createdAt != null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={createdAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-farcaster-channel-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'farcaster-channel-casts',
						label: 'Casts',
					},
				]
			}
			data-card
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionFarcasterChannelCasts({ id, label })}
				<FarcasterCastsView
					selection={selection.$$casts}
					href={
						'id' in selection.entitySelector ?
							resolve(
								'/(social)/(farcaster)/farcaster/(farcasterNetwork)/channel/[channelId=stringSegment]/(farcasterChannel)/casts',
								{
									channelId: selection.entitySelector.id,
								}
							)
						:
							undefined
					}
					collapsible={false}
					title={label}
					emptyText='No Farcaster casts for this channel.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-farcaster-channel-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'farcaster-channel-timestamps',
						label: 'Observations',
					},
				]
			}
			data-card
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionFarcasterChannelTimestamps({ id, label })}
				<FarcasterChannel_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No Farcaster channel observations yet.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
