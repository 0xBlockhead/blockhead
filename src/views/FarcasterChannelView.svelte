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
		collapsible = true,
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
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import Media from '$/components/Media.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterChannel}
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<span>
			/{entityId.id}
		</span>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={channel}>
			{#snippet children(loadedChannel)}
				<span data-row="inline wrap align-center gap-2">
					{#if (
						channel.$icon !== undefined
						&& channel.$icon[EntityMetaKey.Id].url !== undefined
					)}
						<IconComponent
							src={loadedChannel.$icon[EntityMetaKey.Id].url}
							alt=""
						/>
					{/if}
					<span>
						{loadedChannel.name ?? entityId.id}
					</span>
				</span>
			{/snippet}

		</ResourceBoundary>
	{/snippet}

	{#snippet Heading()}
		<span>
			/{entityId.id}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Topic channels group casts under a stable channel id with moderators and optional URLs.
		</p>
		<p>
			Channel feeds in this app load via a FarcasterFeed byChannel variant—not on-chain event logs.
		</p>
	{/snippet}


	{#snippet Content({ title: _title, href: _href })}
		<dl>
			<div>
				<dt>Followers</dt>
				<dd>
					<ResourceBoundary
						resource={channel}
						placeholderText="Loading Farcaster channel (channel id / slug)…"
					>
						{#snippet children(loadedChannel)}
							{#if loadedChannel.followerCount !== undefined}
								{String(channel.followerCount)}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Members</dt>
				<dd>
					<ResourceBoundary
						resource={channel}
						placeholderText="Loading Farcaster channel (channel id / slug)…"
					>
						{#snippet children(loadedChannel)}
							{#if loadedChannel.memberCount !== undefined}
								{String(channel.memberCount)}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Public casting</dt>
				<dd>
					<ResourceBoundary
						resource={channel}
						placeholderText="Loading Farcaster channel (channel id / slug)…"
					>
						{#snippet children(loadedChannel)}
							{#if loadedChannel.publicCasting !== undefined}
								{loadedChannel.publicCasting ? 'Yes' : 'No'}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if open}
				<div>
					<dt>Name</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(loadedChannel)}
								{#if loadedChannel.name !== undefined}
									{loadedChannel.name}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
				<div>
					<dt>URL</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(loadedChannel)}
								{#if loadedChannel.url !== undefined}
									<a href={loadedChannel.url}>{loadedChannel.url}</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Description</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(loadedChannel)}
								{#if loadedChannel.description !== undefined}
									{loadedChannel.description}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Logo</dt>
					<dd data-column>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(loadedChannel)}
								{#if (
									channel.$icon !== undefined
									&& channel.$icon[EntityMetaKey.Id].url !== undefined
								)}
									<Media
										media={{ url: loadedChannel.$icon[EntityMetaKey.Id].url }}
										alt=""
									/>
									<a href={loadedChannel.$icon[EntityMetaKey.Id].url}>{loadedChannel.$icon[EntityMetaKey.Id].url}</a>
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
							{#snippet children(loadedChannel)}
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
							{#snippet children(loadedChannel)}
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
							{#snippet children(loadedChannel)}
								{#if loadedChannel.$$moderators.length}
									<ul>
										{#each loadedChannel.$$moderators as mod (String(mod[EntityMetaKey.Id].fid))}
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
							{#snippet children(loadedChannel)}
								{#if loadedChannel.createdAt !== undefined}
									<Timestamp
										timestamp={loadedChannel.createdAt}
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
							{#snippet children(loadedChannel)}
								{#if loadedChannel.pinnedCastHash !== undefined}
									<span>
										<TruncatedValue
											value={loadedChannel.pinnedCastHash}
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

				<div>
					<dt>External link</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(loadedChannel)}
								{#if loadedChannel.externalLinkUrl !== undefined}
									<a href={loadedChannel.externalLinkUrl}>
										{loadedChannel.externalLinkTitle ?? loadedChannel.externalLinkUrl}
									</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Followed at</dt>
					<dd>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(loadedChannel)}
								{#if loadedChannel.followedAt !== undefined}
									<Timestamp
										timestamp={loadedChannel.followedAt}
									/>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if !open}
				<div>
					<dt>Description</dt>
					<dd data-text="muted">
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel (channel id / slug)…"
						>
							{#snippet children(loadedChannel)}
								{#if loadedChannel.description !== undefined}
									{loadedChannel.description}
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
		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${channelDetailKey}:carousel-channel`}
				sectionIdPrefix={channelDetailKey}
				sections={[
					{ id: 'channel-record', label: 'Record' },
					{ id: 'channel-banner', label: 'Banner' },
				]}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
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

				{#snippet SectionChannelRecord({ id, label })}
					<EntityDetails
						entityType={EntityType.FarcasterChannel}
						{entityId}
					/>
				{/snippet}

				{#snippet SectionChannelBanner({ id, label })}
					<ResourceBoundary
						resource={channel}
						placeholderText="Loading Farcaster channel banner…"
					>
						{#snippet children(loadedChannel)}
							<section data-column>
								<h3>Channel</h3>
								{#if (
									channel.$headerImage !== undefined
									&& channel.$headerImage[EntityMetaKey.Id].url !== undefined
								)}
									<p>
										<Media
											media={{ url: loadedChannel.$headerImage[EntityMetaKey.Id].url }}
											fit="cover"
										/>
									</p>
								{/if}
							</section>
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>

