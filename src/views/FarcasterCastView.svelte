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

	const castSummary = useEntity(
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
		},
	)

	const castRich = useEntity(
		EntityType.FarcasterCast,
		entityId,
		{
			$: [
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
			],
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
				resource={castSummary}
				placeholderText="Loading Farcaster cast (author FID + cast hash)…"
			>
				{#snippet children(row)}
					{#if row.$author.$icon}
						<IconComponent
							shape={IconShape.Circle}
							src={row.$author.$icon[EntityMetaKey.Id].url}
							alt=""
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={castSummary}
			placeholderText="Loading Farcaster cast (author FID + cast hash)…"
		>
			{#snippet children(row)}
				<TruncatedValue
					value={(
						row.text.replaceAll('\n', ' ')
						=== ''
					) ?
						'Cast'
					:
						row.text.replaceAll('\n', ' ')
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
			resource={castSummary}
			placeholderText="Loading Farcaster cast (author FID + cast hash)…"
		>
			{#snippet children(row)}
				{#if variant === 'feed' && row.$author.username !== undefined}
					<span data-text="muted">
						@{row.$author.username}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={castSummary}
			placeholderText="Loading Farcaster cast (author FID + cast hash)…"
		>
			{#snippet children(row)}
				{@const channelId = (
					row.$channel === undefined ?
						undefined
					:
						row.$channel[EntityMetaKey.Id].id
				)}
				{@const channelPageHref = (
					channelId === undefined ?
						undefined
					:
						resolve('/(social)/(farcaster)/farcaster/(channels)/channel/[channelId]', {
							channelId,
						})
				)}
				{@const flatText = row.text.replaceAll('\n', ' ')}
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
										{row.text}
									</p>
								{/if}
							</dd>
						</div>
					{/if}
					<div>
						<dt>Timestamp</dt>
						<dd>
							<Timestamp
								timestamp={row.timestamp}
								format={TimestampFormat.Both}
							/>
						</dd>
					</div>
						{#if row.likeCount !== undefined}
							<div>
								<dt>Likes</dt>
								<dd>{String(row.likeCount)}</dd>
							</div>
						{/if}

						{#if row.recastCount !== undefined}
							<div>
								<dt>Recasts</dt>
								<dd>{String(row.recastCount)}</dd>
							</div>
						{/if}

						{#if row.replyCount !== undefined}
							<div>
								<dt>Replies</dt>
								<dd>{String(row.replyCount)}</dd>
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
								row.$parentCast === undefined ?
									undefined
								:
									row.$parentCast[EntityMetaKey.Id]
							)}
							{@const authorUsernameOpen = row.$author.username}
							{@const threadNormOpen = (
								(() => {
									const th = (
										row.threadHash === undefined ?
											''
										:
											row.threadHash.trim()
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
							<div>
								<dt>Cast hash</dt>
								<dd>
									<span data-text="font-monospace">
										<TruncatedValue
											value={entityId.hash}
											startLength={12}
											endLength={10}
											format={TruncatedValueFormat.Visual}
										/>
									</span>
								</dd>
							</div>
							{#if parentCastHrefOpen !== undefined}
								<div>
									<dt>Parent cast</dt>
									<dd>
										<a href={parentCastHrefOpen}>View parent cast</a>
									</dd>
								</div>
							{/if}

							{#if row.parentUrl !== undefined}
								<div>
									<dt>Parent URL</dt>
									<dd>
										<a href={row.parentUrl}>{row.parentUrl}</a>
									</dd>
								</div>
							{/if}

							{#if row.mentions !== undefined}
								{#if row.mentions.length}
									<div>
										<dt>Mentions</dt>
										<dd>
											<ul data-row="wrap gap-2">
												{#each row.mentions as mention (String(mention))}
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
								resource={castSummary}
									placeholderText="Loading Farcaster cast (author FID + cast hash)…"
							>
								{#snippet children(row)}
									{@const authorId = row.$author[EntityMetaKey.Id]}
									{@const authorUsername = row.$author.username}
									{@const authorDisplayName = row.$author.displayName}
									{@const authorAvatarUrl = (
										row.$author.$icon === undefined ?
											undefined
										:
											row.$author.$icon[EntityMetaKey.Id].url
									)}
									{@const postedViaAppId = (
										row.$postedViaApp === undefined ?
											undefined
										:
											row.$postedViaApp[EntityMetaKey.Id]
									)}
									{@const postedViaUsername = (
										row.$postedViaApp === undefined ?
											undefined
										:
											row.$postedViaApp.username
									)}
									{@const postedViaDisplayName = (
										row.$postedViaApp === undefined ?
											undefined
										:
											row.$postedViaApp.displayName
									)}
									{@const channelId = (
										row.$channel === undefined ?
											undefined
										:
											row.$channel[EntityMetaKey.Id].id
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
										<header data-row="wrap gap-4">
											<div data-row="inline wrap gap-2">
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
													timestamp={row.timestamp}
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
											{row.text}
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
									resource={castRich}
									placeholderText="Loading cast mentions, channel ids & embeds…"
								>
									{#snippet children(rich)}
										<section data-column>
											{#if rich.mentionedProfileFids !== undefined && rich.mentionedProfileFids.length}
												<section data-column>
													<h3>Mentioned profiles (FID)</h3>
													<ul data-row="wrap gap-2">
														{#each rich.mentionedProfileFids as mentionFid (String(mentionFid))}
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

											{#if rich.mentionedChannelIds !== undefined && rich.mentionedChannelIds.length}
												<section data-column>
													<h3>Mentioned channels</h3>
													<ul data-row="wrap gap-2">
														{#each rich.mentionedChannelIds as mentionChId (mentionChId)}
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

											{#if rich.$$embeds.length}
												<section data-column>
													<h3>Embeds</h3>
													<ul data-column>
														{#each rich.$$embeds as embed, embedIndex (String(embedIndex))}
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
												!(rich.mentionedProfileFids?.length)
												&& !(rich.mentionedChannelIds?.length)
												&& !rich.$$embeds.length
											)}
												<div data-row="wrap align-center gap-2">
													<p data-text="muted">
														No mentions or embeds.
													</p>
													<Tooltip contentProps={{ side: 'top' }}>
														{#snippet Content()}
															<p>
																Mentioned profiles, channels, and rich embeds appear when the provider returns them for this cast.
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
