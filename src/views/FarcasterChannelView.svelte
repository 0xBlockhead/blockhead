<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/(social)/(farcaster)/farcaster/(channels)/channel/[channelId]', {
			channelId: entityId.id,
		}),
		open = $bindable(true),
			...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.FarcasterChannel>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

	const channel = useEntity(entityCollectionsContext, EntityType.FarcasterChannel,
		entityId,
		({ sources: [
				Source.Farcaster_Rest,
			], fields: { name: true, url: true, description: true, $icon: true, createdAt: true, followerCount: true, memberCount: true, $$timestamps: ({ sources: [
					Source.Farcaster_Rest,
				], limit: 1 }), pinnedCastHash: true, publicCasting: true, externalLinkTitle: true, externalLinkUrl: true, followedAt: true, ...(open ? ({ $headerImage: true, $lead: true, $moderator: true, $$moderators: true }) : ({  })) } }),
	)


	// Components
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import Media from '$/components/Media.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import FarcasterChannel_TimestampsView from '$/views/FarcasterChannel_TimestampsView.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterChannel}
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={channel}
			placeholderText="Loading Farcaster channel (channel id / slug)…"
		>
			{#snippet children(channel)}
				{#if channel.fields.$icon?.[EntityMetaKey.Id].url}
					<IconComponent
						src={channel.fields.$icon[EntityMetaKey.Id].url}
						alt={channel.fields.name ?? entityId.id}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span>
			/{entityId.id}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={channel}
			placeholderText="Loading Farcaster channel (channel id / slug)…"
		>
			{#snippet children(channel)}
				{channel.fields.name ?? `/${entityId.id}`}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Topic channels group casts under a stable channel id with moderators and optional URLs.
		</p>
		<p>
			Channel feeds in this app load via a FarcasterFeed byChannel variant—not on-chain event logs.
		</p>
	{/snippet}

		{#snippet Content({})}
		<ResourceBoundary
			resource={channel}
			placeholderText="Loading Farcaster channel (channel id / slug)…"
		>
			{#snippet children(channel)}
				{#if channel.fields.description !== undefined}
					<p>
						<TruncatedValue
							value={channel.fields.description}
							format={TruncatedValueFormat.Visual}
						/>
					</p>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<dl>
			<ResourceBoundary
				resource={channel}
				placeholderText="Loading Farcaster channel (channel id / slug)…"
			>
				{#snippet children(channel)}
					<SocialMetricSnapshotRows
						metrics={[
							{
								label: 'Followers',
								value: channel.fields.$$timestamps[0]?.followerCount ?? channel.fields.followerCount,
							},
							{
								label: 'Members',
								value: channel.fields.$$timestamps[0]?.memberCount ?? channel.fields.memberCount,
							},
						]}
					/>
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Public casting</dt>
				<dd>
					<ResourceBoundary
						resource={channel}
						placeholderText="Loading Farcaster channel (channel id / slug)…"
					>
						{#snippet children(channel)}
							{#if channel.fields.publicCasting !== undefined}
								{channel.fields.publicCasting ? 'Yes' : 'No'}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if open}
				<div>
					<dt>URL</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(channel)}
								{#if channel.fields.url !== undefined}
									<a href={channel.fields.url}>{channel.fields.url}</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Lead</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(channel)}
								{#if (
									channel.fields.$lead !== undefined
									&& channel.fields.$lead[EntityMetaKey.Id].fid !== undefined
								)}
									<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
										userId: String(channel.fields.$lead[EntityMetaKey.Id].fid),
									})}>
										FID {String(channel.fields.$lead[EntityMetaKey.Id].fid)}
									</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Moderator</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(channel)}
								{#if (
									channel.fields.$moderator !== undefined
									&& channel.fields.$moderator[EntityMetaKey.Id].fid !== undefined
								)}
									<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
										userId: String(channel.fields.$moderator[EntityMetaKey.Id].fid),
									})}>
										FID {String(channel.fields.$moderator[EntityMetaKey.Id].fid)}
									</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Moderators</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(channel)}
								{#if channel.fields.$$moderators?.values.length}
									<ul>
										{#each channel.fields.$$moderators.values as mod (String(mod[EntityMetaKey.Id].fid))}
											<li>
												<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
													userId: String(mod[EntityMetaKey.Id].fid),
												})}>
													FID {String(mod[EntityMetaKey.Id].fid)}
												</a>
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
					<dt>Created</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(channel)}
								{#if channel.fields.createdAt !== undefined}
									<Timestamp
										timestamp={channel.fields.createdAt}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Pinned cast hash</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(channel)}
								{#if channel.fields.pinnedCastHash !== undefined}
									<span>
										<TruncatedValue
											value={channel.fields.pinnedCastHash}
											startLength={10}
											endLength={8}
											format={TruncatedValueFormat.Visual}
										/>
									</span>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>External link title</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(channel)}
								{#if channel.fields.externalLinkTitle !== undefined}
									{channel.fields.externalLinkTitle}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>External link URL</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(channel)}
								{#if channel.fields.externalLinkUrl !== undefined}
									<a href={channel.fields.externalLinkUrl}>
										{channel.fields.externalLinkUrl}
									</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Followed at</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(channel)}
								{#if channel.fields.followedAt !== undefined}
									<Timestamp
										timestamp={channel.fields.followedAt}
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
		{@const channelDetailKey = stringify(entityId)}
		<CollapsibleTabs
			id={`${channelDetailKey}:carousel-channel`}
			sectionIdPrefix={channelDetailKey}
			sections={collapsibleTabsSections([
				{ id: 'channel-record', label: 'Record' },
				{ id: 'channel-banner', label: 'Banner' },
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
						Channel
					</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionChannelRecord()}
			{/snippet}

			{#snippet SectionChannelBanner()}
				<ResourceBoundary
					resource={channel}
					placeholderText="Loading Farcaster channel banner…"
					>
						{#snippet children(channel)}
							<section data-column>
								<h3>Channel</h3>
								{#if (
									channel.fields.$headerImage !== undefined
									&& channel.fields.$headerImage[EntityMetaKey.Id].url !== undefined
								)}
									<p>
										<Media
											media={{ url: channel.fields.$headerImage[EntityMetaKey.Id].url }}
											fit="cover"
										/>
									</p>
								{/if}
							</section>
						{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionMetricSnapshots()}
				<FarcasterChannel_TimestampsView
					entityFieldReference={{
							entityType: EntityType.FarcasterChannel,
							entityId,
							fieldName: '$$timestamps',
					}}
					href={href}
					id={`${channelDetailKey}:metric-snapshots`}
					title="Metric snapshots"
				/>
			{/snippet}
			</CollapsibleTabs>
		{/snippet}
	</EntityView>
