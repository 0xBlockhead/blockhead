<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { stringify } from 'devalue'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import type { CastHash } from '$/schema/FarcasterCast.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		variant = 'hub',
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.FarcasterCast>
			variant?: 'feed' | 'hub'
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
			| 'HeadingAfter'
			| 'Heading'
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
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterCast}
	{entityId}
	{href}
	bind:open
	{...entityViewRest}
>
	{#snippet Icon()}
		{#if variant === 'feed'}
			<ResourceBoundary
				resource={cast}
				placeholderText="Loading Farcaster cast (author FID + cast hash)…"
			>
				{#snippet children(cast)}
					{#if cast.$author.$icon}
						<IconComponent
							shape={IconShape.Circle}
							src={cast.$author.$icon[EntityMetaKey.Id].url}
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
			{#snippet children(cast)}
				<TruncatedValue
					value={(
						cast.text.replaceAll('\n', ' ')
						=== ''
					) ?
						'Cast'
					:
						cast.text.replaceAll('\n', ' ')
					}
					startLength={56}
					endLength={24}
					format={TruncatedValueFormat.Abbr}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.hash}
		</span>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={cast}
			placeholderText="Loading Farcaster cast (author FID + cast hash)…"
		>
			{#snippet children(cast)}
				{#if variant === 'feed' && cast.$author.username !== undefined}
					<span data-text="muted">
						@{cast.$author.username}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={cast}
			placeholderText="Loading Farcaster cast (author FID + cast hash)…"
		>
			{#snippet children(cast)}
				{@const channelId = (
					cast.$channel === undefined ?
						undefined
					:
						cast.$channel[EntityMetaKey.Id].id
				)}
				{@const channelPageHref = (
					channelId === undefined ?
						undefined
					:
						resolve('/(social)/(farcaster)/farcaster/(channels)/channel/[channelId]', {
							channelId,
						})
				)}
				{@const flatText = cast.text.replaceAll('\n', ' ')}
				<dl>
					{#if flatText !== ''}
						<div>
							<dt>Cast</dt>
							<dd>
								{#if variant === 'feed'}
									<p>
										<TruncatedValue
											value={flatText}
											startLength={120}
											endLength={48}
											format={TruncatedValueFormat.Abbr}
										/>
									</p>
								{:else}
									<p>
										{cast.text}
									</p>
								{/if}
							</dd>
						</div>
					{/if}
					<div>
						<dt>Timestamp</dt>
						<dd>
							<Timestamp
								timestamp={cast.timestamp}
								format={TimestampFormat.Both}
							/>
						</dd>
					</div>
						{#if cast.likeCount !== undefined}
							<div>
								<dt>Likes</dt>
								<dd>{String(cast.likeCount)}</dd>
							</div>
						{/if}

						{#if cast.recastCount !== undefined}
							<div>
								<dt>Recasts</dt>
								<dd>{String(cast.recastCount)}</dd>
							</div>
						{/if}

						{#if cast.replyCount !== undefined}
							<div>
								<dt>Replies</dt>
								<dd>{String(cast.replyCount)}</dd>
							</div>
						{/if}

						{#if channelPageHref !== undefined}
							{#if channelId !== undefined}
								<div>
									<dt>Channel</dt>
									<dd>
										<a href={channelPageHref}>
											/{channelId}
										</a>
									</dd>
								</div>
							{/if}
						{/if}

						{#if open}
							{@const parentCastIdOpen = (
								cast.$parentCast === undefined ?
									undefined
								:
									cast.$parentCast[EntityMetaKey.Id]
							)}
							{@const authorUsernameOpen = cast.$author.username}
							{@const threadNormOpen = (
								(() => {
									const th = (
										cast.threadHash === undefined ?
											''
										:
											cast.threadHash.trim()
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
							{@const farcasterWebCastHrefOpen = (
								authorUsernameOpen === undefined ?
									undefined
								:
									`https://farcaster.xyz/${authorUsernameOpen}/${entityId.hash}`
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
							<div>
								<dt>FID</dt>
								<dd>{String(entityId.fid)}</dd>
							</div>
							{#if parentCastHrefOpen !== undefined}
								<div>
									<dt>Parent cast</dt>
									<dd>
										<a href={parentCastHrefOpen}>View parent cast</a>
									</dd>
								</div>
							{/if}

							{#if cast.parentUrl !== undefined}
								<div>
									<dt>Parent URL</dt>
									<dd>
										<a href={cast.parentUrl}>{cast.parentUrl}</a>
									</dd>
								</div>
							{/if}

							{#if cast.mentions !== undefined}
								{#if cast.mentions.length}
									<div>
										<dt>Mentions</dt>
										<dd>
											<ul data-cast="wrap gap-2">
												{#each cast.mentions as mention (String(mention))}
													<li>
														<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
															userId: String(mention),
														})}>
															FID {String(mention)}
														</a>
													</li>
												{/each}
											</ul>
										</dd>
									</div>
								{/if}
							{/if}

							{#if farcasterWebCastHrefOpen !== undefined}
								<div>
									<dt>On web</dt>
									<dd>
										<a
											href={farcasterWebCastHrefOpen}
											rel="noreferrer"
										>Open on Farcaster</a>
									</dd>
								</div>
							{/if}

							{#if warpcastThreadHrefOpen !== undefined}
								<div>
									<dt>Thread</dt>
									<dd>
										<a
											href={warpcastThreadHrefOpen}
											rel="noreferrer"
										>Open thread on Warpcast</a>
									</dd>
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

				{#snippet children({
					open: _paneOpen,
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
								{#snippet children(cast)}
									{@const authorId = cast.$author[EntityMetaKey.Id]}
									{@const authorUsername = cast.$author.username}
									{@const authorDisplayName = cast.$author.displayName}
									{@const authorAvatarUrl = (
										cast.$author.$icon === undefined ?
											undefined
										:
											cast.$author.$icon[EntityMetaKey.Id].url
									)}
									{@const postedViaAppId = (
										cast.$postedViaApp === undefined ?
											undefined
										:
											cast.$postedViaApp[EntityMetaKey.Id]
									)}
									{@const postedViaUsername = (
										cast.$postedViaApp === undefined ?
											undefined
										:
											cast.$postedViaApp.username
									)}
									{@const postedViaDisplayName = (
										cast.$postedViaApp === undefined ?
											undefined
										:
											cast.$postedViaApp.displayName
									)}
									{@const channelId = (
										cast.$channel === undefined ?
											undefined
										:
											cast.$channel[EntityMetaKey.Id].id
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
													timestamp={cast.timestamp}
													format={TimestampFormat.Absolute}
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
											{cast.text}
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
									{#snippet children(cast)}
										<section data-column>
											{#if cast.mentionedProfileFids !== undefined && cast.mentionedProfileFids.length}
												<section data-column>
													<h3>Mentioned profiles (FID)</h3>
													<ul data-row="wrap gap-2">
														{#each cast.mentionedProfileFids as mentionFid (String(mentionFid))}
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

											{#if cast.mentionedChannelIds !== undefined && cast.mentionedChannelIds.length}
												<section data-column>
													<h3>Mentioned channels</h3>
													<ul data-row="wrap gap-2">
														{#each cast.mentionedChannelIds as mentionChId (mentionChId)}
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

											{#if cast.$$embeds.length}
												<section data-column>
													<h3>Embeds</h3>
													<ul data-column>
														{#each cast.$$embeds as embed, embedIndex (String(embedIndex))}
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
																			<span data-text="font-monospace">
																				<TruncatedValue
																					value={embeddedCastId.hash}
																					startLength={8}
																					endLength={6}
																					format={TruncatedValueFormat.Visual}
																				/>
																			</span>
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
												&& !cast.$$embeds.length
											)}
												<div data-row="wrap align-center gap-2">
													<p data-text="muted">
														No mentions or embeds.
													</p>
													<Tooltip contentProps={{ side: 'top' }}>
														{#snippet Content()}
															<p>
																Mentioned profiles, channels, and cast embeds appear when the provider returns them for this cast.
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
