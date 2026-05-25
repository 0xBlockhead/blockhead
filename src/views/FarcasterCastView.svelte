<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { CastHash } from '$/schema/FarcasterCast.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		href = resolve('/(social)/(farcaster)/farcaster/(feed)/cast/[fid]/[hash]', {
			fid: String(entityId.fid),
			hash: entityId.hash,
		}),
		variant = 'hub',
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.FarcasterCast>
			href?: string
			variant?: 'feed' | 'hub'
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const cast = useEntity(
		EntityType.FarcasterCast,
		entityId,
		{
			$: [
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
			],
			text: {},
			timestamp: {},
			parentUrl: {},
			mentions: {},
			likeCount: {},
			recastCount: {},
			replyCount: {},
			threadHash: {},
			$author: {
				username: {},
				displayName: {},
				$icon: {},
			},
			$parentCast: {},
			$postedViaApp: {
				username: {},
				displayName: {},
			},
			$channel: {},
			...(open ?
				{
					mentionedProfileFids: {},
					mentionedChannelIds: {},
					$$embeds: {
						url: {},
						title: {},
						description: {},
						quotedPreviewText: {},
						$embeddedCast: {},
						$icon: {},
					},
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
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterCast}
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		{#if variant === 'feed'}
			<ResourceBoundary
				resource={cast}
				placeholderText="Loading Farcaster cast (author FID + cast hash)…"
			>
				{#snippet children(loadedCast)}
					{#if loadedCast.$author.$icon}
						<IconComponent
							shape={IconShape.Circle}
							src={loadedCast.$author.$icon[EntityMetaKey.Id].url}
							alt=""
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={cast}
			placeholderText="Loading Farcaster cast (author FID + cast hash)…"
		>
			{#snippet children(loadedCast)}
				<TruncatedValue
					value={(
						cast.text.replaceAll('\n', ' ')
						=== ''
					) ?
						'Cast'
					:
						loadedCast.text.replaceAll('\n', ' ')
					}
					startLength={56}
					endLength={24}
					format={TruncatedValueFormat.Abbr}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<span data-text="font-monospace">
			{entityId.hash}
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Immutable cast keyed by author FID and cast hash; thread, channel, and embed fields come from hub indexers.
		</p>
		<p>
			Engagement counts are off-chain snapshots—not consensus tallies or DEX quotes.
		</p>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={cast}
			placeholderText="Loading Farcaster cast (author FID + cast hash)…"
		>
			{#snippet children(loadedCast)}
				{#if variant === 'feed' && loadedCast.$author.username !== undefined}
					<span data-text="muted">
						@{loadedCast.$author.username}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}


	{#snippet Content({ title: _title, href: _href })}
		<dl>
			<div>
				<dt>Cast</dt>
				<dd>
					<ResourceBoundary
						resource={cast}
						placeholderText="Loading Farcaster cast (author FID + cast hash)…"
					>
						{#snippet children(loadedCast)}
							{@const flatText = loadedCast.text.replaceAll('\n', ' ')}
							{#if (
								flatText !== ''
								&& variant === 'feed'
							)}
								<p>
								<TruncatedValue
								value={flatText}
								startLength={120}
								endLength={48}
								format={TruncatedValueFormat.Abbr}
								/>
							</p>
							{:else if flatText !== ''}
								<p>
								{loadedCast.text}
								</p>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={cast}
						placeholderText="Loading Farcaster cast (author FID + cast hash)…"
					>
						{#snippet children(loadedCast)}
							<Timestamp
								timestamp={loadedCast.timestamp}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
			<div>
				<dt>Likes</dt>
				<dd>
					<ResourceBoundary
						resource={cast}
						placeholderText="Loading Farcaster cast (author FID + cast hash)…"
					>
						{#snippet children(loadedCast)}
							{#if loadedCast.likeCount !== undefined}
								{String(cast.likeCount)}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Recasts</dt>
				<dd>
					<ResourceBoundary
						resource={cast}
						placeholderText="Loading Farcaster cast (author FID + cast hash)…"
					>
						{#snippet children(loadedCast)}
							{#if loadedCast.recastCount !== undefined}
								{String(cast.recastCount)}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Replies</dt>
				<dd>
					<ResourceBoundary
						resource={cast}
						placeholderText="Loading Farcaster cast (author FID + cast hash)…"
					>
						{#snippet children(loadedCast)}
							{#if loadedCast.replyCount !== undefined}
								{String(cast.replyCount)}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Channel</dt>
				<dd>
					<ResourceBoundary
						resource={cast}
						placeholderText="Loading Farcaster cast (author FID + cast hash)…"
					>
						{#snippet children(loadedCast)}
							{@const channelId = (
								cast.$channel === undefined ?
									undefined
								:
									loadedCast.$channel[EntityMetaKey.Id].id
							)}
							{@const channelPageHref = (
								channelId === undefined ?
									undefined
								:
									resolve('/(social)/(farcaster)/farcaster/(channels)/channel/[channelId]', {
										channelId,
									})
							)}
							{#if (
								channelPageHref !== undefined
								&& channelId !== undefined
							)}
								<a href={channelPageHref}>
									/{channelId}
								</a>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if open}
				<div>
					<dt>FID</dt>
					<dd>{String(entityId.fid)}</dd>
				</div>
				<div>
					<dt>Parent cast</dt>
					<dd>
						<ResourceBoundary
							resource={cast}
							placeholderText="Loading Farcaster cast (author FID + cast hash)…"
						>
							{#snippet children(loadedCast)}
								{@const parentCastIdOpen = (
									cast.$parentCast === undefined ?
										undefined
									:
										loadedCast.$parentCast[EntityMetaKey.Id]
								)}
								{@const parentCastHrefOpen = (
									parentCastIdOpen === undefined ?
										undefined
									:
										resolve('/(social)/(farcaster)/farcaster/(feed)/cast/[fid]/[hash]', {
											fid: String(parentCastIdOpen.fid),
											hash: parentCastIdOpen.hash,
										})
								)}
								{#if parentCastHrefOpen !== undefined}
									<a href={parentCastHrefOpen}>View parent cast</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Parent URL</dt>
					<dd>
						<ResourceBoundary
							resource={cast}
							placeholderText="Loading Farcaster cast (author FID + cast hash)…"
						>
							{#snippet children(loadedCast)}
								{#if loadedCast.parentUrl !== undefined}
									<a href={loadedCast.parentUrl}>{loadedCast.parentUrl}</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Mentions</dt>
					<dd>
						<ResourceBoundary
							resource={cast}
							placeholderText="Loading Farcaster cast (author FID + cast hash)…"
						>
							{#snippet children(loadedCast)}
								{#if (
									cast.mentions !== undefined
									&& cast.mentions.length
								)}
									<ul data-cast="wrap gap-2">
										{#each loadedCast.mentions as mention (String(mention))}
											<li>
												<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
													userId: String(mention),
												})}>
													FID {String(mention)}
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
					<dt>On web</dt>
					<dd>
						<ResourceBoundary
							resource={cast}
							placeholderText="Loading Farcaster cast (author FID + cast hash)…"
						>
							{#snippet children(loadedCast)}
								{@const authorUsernameOpen = loadedCast.$author.username}
								{@const farcasterWebCastHrefOpen = (
									authorUsernameOpen === undefined ?
										undefined
									:
										`https://farcaster.xyz/${authorUsernameOpen}/${entityId.hash}`
								)}
								{#if farcasterWebCastHrefOpen !== undefined}
									<a
										href={farcasterWebCastHrefOpen}
										rel="noreferrer"
									>Open on Farcaster</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>

				<div>
					<dt>Thread</dt>
					<dd>
						<ResourceBoundary
							resource={cast}
							placeholderText="Loading Farcaster cast (author FID + cast hash)…"
						>
							{#snippet children(loadedCast)}
								{@const threadNormOpen = (
									(() => {
										const th = (
											cast.threadHash === undefined ?
												''
											:
												loadedCast.threadHash.trim()
										)
										if (th === '') {
											return undefined
										}
										const hex = (
											th.startsWith('0x') || th.startsWith('0X') ?
												th.slice(2)
											:
												th
										)
										return `0x${hex.toLowerCase()}` satisfies CastHash
									})()
								)}
								{@const warpcastThreadHrefOpen = (
									threadNormOpen !== undefined && threadNormOpen !== entityId.hash ?
										`https://warpcast.com/~/conversations/${threadNormOpen}`
									:
										undefined
								)}
								{#if warpcastThreadHrefOpen !== undefined}
									<a
										href={warpcastThreadHrefOpen}
										rel="noreferrer"
									>Open thread on Warpcast</a>
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
		{@const castDetailKey = stringify(entityId)}
		<div
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${castDetailKey}:carousel-cast`}
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
							Cast
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({
					open: _markersOpen,
				})}
					<a
						data-scroll-marker-label="Record"
						href={`#${castDetailKey}:cast-record`}
					>Record</a>
					{#if children}
						<a
							data-scroll-marker-label="More"
							href={`#${castDetailKey}:cast-more`}
						>More</a>
					{:else}
						<a
							data-scroll-marker-label="Thread"
							href={`#${castDetailKey}:cast-thread`}
						>Thread</a>
						{#if open}
							<a
								data-scroll-marker-label="Embeds"
								href={`#${castDetailKey}:cast-media`}
							>Embeds</a>
						{/if}
					{/if}
				{/snippet}

				{#snippet body({ open: _paneOpen,
				})}
					<section
						data-scroll-marker-label="Record"
						id={`${castDetailKey}:cast-record`}
					>
						<EntityDetails
							entityType={EntityType.FarcasterCast}
							{entityId}
						/>
					</section>
					{#if children}
						<section
							id={`${castDetailKey}:cast-more`}
						>
							{@render children()}
						</section>
					{:else}
						<section
							data-scroll-marker-label="Thread"
							id={`${castDetailKey}:cast-thread`}
						>
							<ResourceBoundary
								resource={cast}
									placeholderText="Loading Farcaster cast (author FID + cast hash)…"
							>
								{#snippet children(loadedCast)}
									{@const authorId = loadedCast.$author[EntityMetaKey.Id]}
									{@const authorUsername = loadedCast.$author.username}
									{@const authorDisplayName = loadedCast.$author.displayName}
									{@const authorAvatarUrl = (
										cast.$author.$icon === undefined ?
											undefined
										:
											loadedCast.$author.$icon[EntityMetaKey.Id].url
									)}
									{@const postedViaAppId = (
										cast.$postedViaApp === undefined ?
											undefined
										:
											loadedCast.$postedViaApp[EntityMetaKey.Id]
									)}
									{@const postedViaUsername = (
										cast.$postedViaApp === undefined ?
											undefined
										:
											loadedCast.$postedViaApp.username
									)}
									{@const postedViaDisplayName = (
										cast.$postedViaApp === undefined ?
											undefined
										:
											loadedCast.$postedViaApp.displayName
									)}
									{@const channelId = (
										cast.$channel === undefined ?
											undefined
										:
											loadedCast.$channel[EntityMetaKey.Id].id
									)}
									{@const channelPageHref = (
										channelId === undefined ?
											undefined
										:
											resolve('/(social)/(farcaster)/farcaster/(channels)/channel/[channelId]', {
												channelId,
											})
									)}
									<section data-column>
										<header data-cast="wrap gap-4">
											<div data-cast="inline wrap gap-2">
												{#if authorAvatarUrl !== undefined}
													<IconComponent
														shape={IconShape.Circle}
														src={authorAvatarUrl}
														alt=""
														size="2.5rem"
													/>
												{/if}
												<div data-column>
													<strong>
														{authorDisplayName ?? authorUsername ?? `FID ${String(authorId.fid)}`}
													</strong>
													{#if authorUsername !== undefined}
														<span data-text="muted">
															<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
																userId: String(authorId.fid),
															})}>
																@{authorUsername}
															</a>
														</span>
													{/if}
												</div>
											</div>
											<p data-text="muted">
												<Timestamp
													timestamp={loadedCast.timestamp}
												/>
											</p>
											{#if postedViaAppId !== undefined}
												<p data-text="muted">
													Cast via{' '}
													<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
														userId: String(postedViaAppId.fid),
													})}>
														{postedViaDisplayName ?? postedViaUsername ?? `FID ${String(postedViaAppId.fid)}`}
													</a>
												</p>
											{/if}

											{#if channelPageHref !== undefined}
												{#if channelId !== undefined}
													<p data-text="muted">
														<a href={channelPageHref}>
															/{channelId}
														</a>
													</p>
												{/if}
											{/if}
										</header>

										<p>
											{loadedCast.text}
										</p>
									</section>
								{/snippet}
							</ResourceBoundary>
						</section>
						{#if open}
							<section
								data-scroll-marker-label="Embeds"
								id={`${castDetailKey}:cast-media`}
							>
								<ResourceBoundary
									resource={cast}
									placeholderText="Loading cast mentions, channel ids & embeds…"
								>
									{#snippet children(loadedCast)}
										<section data-column>
											{#if loadedCast.mentionedProfileFids !== undefined && loadedCast.mentionedProfileFids.length}
												<section data-column>
													<h3>Mentioned profiles (FID)</h3>
													<ul data-row="wrap gap-2">
														{#each loadedCast.mentionedProfileFids as mentionFid (String(mentionFid))}
															<li>
																<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
																	userId: String(mentionFid),
																})}>
																	FID {String(mentionFid)}
																</a>
															</li>
														{/each}
													</ul>
												</section>
											{/if}

											{#if loadedCast.mentionedChannelIds !== undefined && loadedCast.mentionedChannelIds.length}
												<section data-column>
													<h3>Mentioned channels</h3>
													<ul data-row="wrap gap-2">
														{#each loadedCast.mentionedChannelIds as mentionChId (mentionChId)}
															<li>
																<a href={resolve('/(social)/(farcaster)/farcaster/(channels)/channel/[channelId]', {
																	channelId: mentionChId,
																})}>
																	/{mentionChId}
																</a>
															</li>
														{/each}
													</ul>
												</section>
											{/if}

											{#if loadedCast.$$embeds.length}
												<section data-column>
													<h3>Embeds</h3>
													<ul data-column>
														{#each loadedCast.$$embeds as embed, embedIndex (String(embedIndex))}
															{@const og = (
																embed.$icon === undefined ?
																	undefined
																:
																	embed.$icon[EntityMetaKey.Id].url
															)}
															{@const embeddedCastId = (
																embed.$embeddedCast === undefined ?
																	undefined
																:
																	embed.$embeddedCast[EntityMetaKey.Id]
															)}
															<li data-column>
																{#if og !== undefined}
																	<p>
																		<a
																			href={embed.url ?? og}
																			rel="noreferrer"
																		>
																			<img
																				src={og}
																				alt=""
																				loading="lazy"
																			/>
																		</a>
																	</p>
																{/if}

																{#if embed.title !== undefined}
																	<p>
																		<strong>{embed.title}</strong>
																	</p>
																{/if}

																{#if embed.description !== undefined}
																	<p data-text="muted">
																		{embed.description}
																	</p>
																{/if}

																{#if embed.url !== undefined}
																	<p>
																		<a
																			href={embed.url}
																			rel="noreferrer"
																		>{embed.url}</a>
																	</p>
																{/if}

																{#if embed.quotedPreviewText !== undefined}
																	<blockquote>
																		<p>
																			{embed.quotedPreviewText}
																		</p>
																	</blockquote>
																{/if}

																{#if embeddedCastId !== undefined}
																	<p>
																		<a href={resolve('/(social)/(farcaster)/farcaster/(feed)/cast/[fid]/[hash]', {
																			fid: String(embeddedCastId.fid),
																			hash: embeddedCastId.hash,
																		})}>
																			Quoted cast · FID {String(embeddedCastId.fid)} ·{' '}
																			<TruncatedValue
																				value={embeddedCastId.hash}
																				startLength={8}
																				endLength={6}
																				format={TruncatedValueFormat.Visual}
																			/>
																		</a>
																	</p>
																{/if}
															</li>
														{/each}
													</ul>
												</section>
											{/if}

											{#if (
												!(cast.mentionedProfileFids?.length)
												&& !(cast.mentionedChannelIds?.length)
												&& !loadedCast.$$embeds.length
											)}
												<div data-row="wrap align-center gap-2">
													<p data-text="muted">
														No mentions or embeds.
													</p>
													<Tooltip contentProps={{ side: 'top' }}>
														{#snippet Content()}
															<p>
																Mentioned profiles, channels, and cast embeds appear when the provider returns them for this loadedCast.
															</p>
														{/snippet}
														<abbr
															class="entity-heading-tip"
															aria-label="Mentions and embeds"
														>ⓘ</abbr>
													</Tooltip>
												</div>
											{/if}
										</section>
									{/snippet}
								</ResourceBoundary>
							</section>
						{/if}
					{/if}
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>

