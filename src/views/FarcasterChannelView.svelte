<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { stringify } from 'devalue'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.FarcasterChannel>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'Icon'
			| 'Heading'
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
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterChannel}
	{entityId}
	{href}
	bind:open
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet Title()}
		<ResourceBoundary resource={channel}>
			{#snippet children(channel)}
				<span data-row="inline wrap align-center gap-2">
					{#if channel.$icon !== undefined}
						{#if channel.$icon[EntityMetaKey.Id].url !== undefined}
							<IconComponent
								src={channel.$icon[EntityMetaKey.Id].url}
								alt=""
							/>
						{/if}
					{/if}
					<span>
						{channel.name ?? entityId.id}
					</span>
				</span>
			{/snippet}

		</ResourceBoundary>
	{/snippet}

	{#snippet Heading()}
		<span data-text="font-monospace">
			/{entityId.id}
		</span>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={channel}
			placeholderText="Loading Farcaster channel (channel id / slug)…"
		>
			{#snippet children(channel)}
				<dl>
						{#if channel.followerCount !== undefined}
							<div>
								<dt>Followers</dt>
								<dd>{String(channel.followerCount)}</dd>
							</div>
						{/if}

						{#if channel.memberCount !== undefined}
							<div>
								<dt>Members</dt>
								<dd>{String(channel.memberCount)}</dd>
							</div>
						{/if}

						{#if channel.publicCasting !== undefined}
							<div>
								<dt>Public casting</dt>
								<dd>{channel.publicCasting ? 'Yes' : 'No'}</dd>
							</div>
						{/if}

						{#if open}
							{#if channel.name !== undefined}
								<div>
									<dt>Name</dt>
									<dd>{channel.name}</dd>
								</div>
							{/if}
							{#if channel.url !== undefined}
								<div>
									<dt>URL</dt>
									<dd>
										<a href={channel.url}>{channel.url}</a>
									</dd>
								</div>
							{/if}

							{#if channel.description !== undefined}
								<div>
									<dt>Description</dt>
									<dd>{channel.description}</dd>
								</div>
							{/if}

							{#if channel.$icon !== undefined}
								{#if channel.$icon[EntityMetaKey.Id].url !== undefined}
									<div>
										<dt>Logo</dt>
										<dd data-column>
											<Media
												media={{ url: channel.$icon[EntityMetaKey.Id].url }}
												alt=""
											/>
											<a href={channel.$icon[EntityMetaKey.Id].url}>{channel.$icon[EntityMetaKey.Id].url}</a>
										</dd>
									</div>
								{/if}
							{/if}

							{#if channel.$lead !== undefined}
								{#if channel.$lead[EntityMetaKey.Id].fid !== undefined}
									<div>
										<dt>Lead</dt>
										<dd>
											<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
												userId: String(channel.$lead[EntityMetaKey.Id].fid),
											})}>
												FID {String(channel.$lead[EntityMetaKey.Id].fid)}
											</a>
										</dd>
									</div>
								{/if}
							{/if}

							{#if channel.$moderator !== undefined}
								{#if channel.$moderator[EntityMetaKey.Id].fid !== undefined}
									<div>
										<dt>Moderator</dt>
										<dd>
											<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
												userId: String(channel.$moderator[EntityMetaKey.Id].fid),
											})}>
												FID {String(channel.$moderator[EntityMetaKey.Id].fid)}
											</a>
										</dd>
									</div>
								{/if}
							{/if}

							{#if channel.$$moderators.length}
								<div>
									<dt>Moderators</dt>
									<dd>
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
									</dd>
								</div>
							{/if}

							{#if channel.createdAt !== undefined}
								<div>
									<dt>Created</dt>
									<dd>
										<Timestamp
											timestamp={channel.createdAt}
											format={TimestampFormat.Both}
										/>
									</dd>
								</div>
							{/if}

							{#if channel.pinnedCastHash !== undefined}
								<div>
									<dt>Pinned cast hash</dt>
									<dd>
										<span data-text="font-monospace">
											<TruncatedValue
												value={channel.pinnedCastHash}
												startLength={10}
												endLength={8}
												format={TruncatedValueFormat.Visual}
											/>
										</span>
									</dd>
								</div>
							{/if}

							{#if channel.externalLinkUrl !== undefined}
								<div>
									<dt>External link</dt>
									<dd>
										<a href={channel.externalLinkUrl}>
											{channel.externalLinkTitle ?? channel.externalLinkUrl}
										</a>
									</dd>
								</div>
							{/if}

							{#if channel.followedAt !== undefined}
								<div>
									<dt>Followed at</dt>
									<dd>
										<Timestamp
											timestamp={channel.followedAt}
											format={TimestampFormat.Both}
										/>
									</dd>
								</div>
						{/if}
					{/if}

					{#if channel.description !== undefined}
						{#if !open}
							<div>
								<dt>Description</dt>
								<dd data-text="muted">{channel.description}</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
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

				{#snippet Markers({
					open: _markersOpen,
				})}
					<a
						data-scroll-marker-label="Record"
						href={`#${channelDetailKey}:channel-record`}
					>Record</a>
					<a
						data-scroll-marker-label="Banner"
						href={`#${channelDetailKey}:channel-banner`}
					>Banner</a>
					{#if children}
						<a
							data-scroll-marker-label="More"
							href={`#${channelDetailKey}:channel-more`}
						>More</a>
					{/if}
				{/snippet}

				{#snippet body({ open: _paneOpen,
				})}
					<section
						data-scroll-marker-label="Record"
						id={`${channelDetailKey}:channel-record`}
					>
						<EntityDetails
							entityType={EntityType.FarcasterChannel}
							{entityId}
						/>
					</section>
					<section
						data-scroll-marker-label="Banner"
						id={`${channelDetailKey}:channel-banner`}
					>
						<ResourceBoundary
							resource={channel}
							placeholderText="Loading Farcaster channel banner…"
						>
							{#snippet children(channel)}
								<section data-column>
									<h3>Channel</h3>
									{#if channel.$headerImage !== undefined}
										{#if channel.$headerImage[EntityMetaKey.Id].url !== undefined}
											<p>
												<Media
													media={{ url: channel.$headerImage[EntityMetaKey.Id].url }}
													fit="cover"
												/>
											</p>
										{/if}
									{/if}
								</section>
							{/snippet}
						</ResourceBoundary>
					</section>
					{#if children}
						<section
							data-scroll-marker-label="More"
							id={`${channelDetailKey}:channel-more`}
						>
							{@render children()}
						</section>
					{/if}
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>


<style>
	.entity-view-detail-carousels :global(.collapsible-tabs-scroll[data-scroll-container]) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 36ch;
			}
		}
	}
</style>
