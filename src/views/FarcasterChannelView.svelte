<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
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


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const channel = useEntity(
		EntityType.FarcasterChannel,
		entityId,
		{
			$: [
				Source.Farcaster_Rest,
			],
			name: {},
			url: {},
			description: {},
			$icon: {},
			createdAt: {},
			followerCount: {},
			memberCount: {},
			$$timestamps: {
				$: [
					Source.Farcaster_Rest,
				],
				$limit: 1,
			},
			pinnedCastHash: {},
			publicCasting: {},
			externalLinkTitle: {},
			externalLinkUrl: {},
			followedAt: {},
			...(open ?
				{
					$headerImage: {},
					$lead: {},
					$moderator: {},
					$$moderators: {},
				}
			:
				{}),
		},
	)


	// Components
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
				{#if channel.$icon?.[EntityMetaKey.Id].url}
					<IconComponent
						src={channel.$icon[EntityMetaKey.Id].url}
						alt={channel.name ?? entityId.id}
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
				{channel.name ?? `/${entityId.id}`}
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
				{#if channel.description !== undefined}
					<p>
						<TruncatedValue
							value={channel.description}
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
								value: channel.$$timestamps[0]?.followerCount ?? channel.followerCount,
							},
							{
								label: 'Members',
								value: channel.$$timestamps[0]?.memberCount ?? channel.memberCount,
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
							{#if channel.publicCasting !== undefined}
								{channel.publicCasting ? 'Yes' : 'No'}
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
								{#if channel.url !== undefined}
									<a href={channel.url}>{channel.url}</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Icon</dt>
					<dd data-column>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(channel)}
								{#if (
									channel.$icon !== undefined
									&& channel.$icon[EntityMetaKey.Id].url !== undefined
								)}
									<Media
										media={{ url: channel.$icon[EntityMetaKey.Id].url }}
										alt=""
									/>
									<a href={channel.$icon[EntityMetaKey.Id].url}>{channel.$icon[EntityMetaKey.Id].url}</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Lead</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(channel)}
								{#if (
									channel.$lead !== undefined
									&& channel.$lead[EntityMetaKey.Id].fid !== undefined
								)}
									<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
										userId: String(channel.$lead[EntityMetaKey.Id].fid),
									})}>
										FID {String(channel.$lead[EntityMetaKey.Id].fid)}
									</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Moderator</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(channel)}
								{#if (
									channel.$moderator !== undefined
									&& channel.$moderator[EntityMetaKey.Id].fid !== undefined
								)}
									<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
										userId: String(channel.$moderator[EntityMetaKey.Id].fid),
									})}>
										FID {String(channel.$moderator[EntityMetaKey.Id].fid)}
									</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Moderators</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(channel)}
								{#if channel.$$moderators.length}
									<ul>
										{#each channel.$$moderators as mod (String(mod[EntityMetaKey.Id].fid))}
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

				<div>
					<dt>Created</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(channel)}
								{#if channel.createdAt !== undefined}
									<Timestamp
										timestamp={channel.createdAt}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Pinned cast hash</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(channel)}
								{#if channel.pinnedCastHash !== undefined}
									<span>
										<TruncatedValue
											value={channel.pinnedCastHash}
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

					<ResourceBoundary
						resource={channel}
						placeholderText="Loading Farcaster channel (channel id / slug)…"
					>
						{#snippet children(channel)}
							{#if channel.externalLinkTitle !== undefined}
								<div>
									<dt>External link title</dt>
									<dd>{channel.externalLinkTitle}</dd>
								</div>
							{/if}

							{#if channel.externalLinkUrl !== undefined}
								<div>
									<dt>External link URL</dt>
									<dd>
										<a href={channel.externalLinkUrl}>
											{channel.externalLinkUrl}
										</a>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

				<div>
					<dt>Followed at</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(channel)}
								{#if channel.followedAt !== undefined}
									<Timestamp
										timestamp={channel.followedAt}
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
									channel.$headerImage !== undefined
									&& channel.$headerImage[EntityMetaKey.Id].url !== undefined
								)}
									<p>
										<Media
											media={{ url: channel.$headerImage[EntityMetaKey.Id].url }}
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
