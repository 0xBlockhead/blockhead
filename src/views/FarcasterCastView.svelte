<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href,
		variant = 'hub',
		open = $bindable(true),
			...EntityViewProps
	}: WithRest<
		{
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

	const cast = useEntity(
		EntityType.FarcasterCast,
		entityId,
		{
			$: [
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
				Source.Farcaster_Rest,
			],
			fid: {},
			hash: {},
			username: {},
			hashPrefix: {},
			clientUrl: {},
			text: {},
			timestamp: {},
			parentUrl: {},
			mentions: {},
			likeCount: {},
			recastCount: {},
			replyCount: {},
			$$timestamps: {
				$: [
					Source.Neynar_Rest,
					Source.Snapchain_Rest,
				],
				$limit: 1,
			},
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
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import FarcasterCast_TimestampsView from '$/views/FarcasterCast_TimestampsView.svelte'
	import SocialMetricSnapshotRows from '$/views/SocialMetricSnapshotRows.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterCast}
	{entityId}
	href={href ?? (
		'fid' in entityId && 'hash' in entityId ?
			resolve('/(social)/(farcaster)/farcaster/(feed)/cast/[fid]/[hash]', {
				fid: String(entityId.fid),
				hash: entityId.hash,
			})
		: 'username' in entityId && 'hashPrefix' in entityId ?
			resolve('/(social)/(farcaster)/farcaster/(feed)/c/[fname]/[hash]', {
				fname: entityId.username,
				hash: entityId.hashPrefix,
			})
		: 'clientUrl' in entityId ?
			resolve('/(social)/(farcaster)/farcaster/open-cast')
		:
			undefined
	)}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		{#if variant === 'feed'}
			<ResourceBoundary
				resource={cast}
				placeholderText="Loading Farcaster cast (author FID + cast hash)…"
			>
				{#snippet children(cast)}
					{#if cast.$author?.$icon}
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

	{#snippet Value()}
		<ResourceBoundary
			resource={cast}
			placeholderText="Loading Farcaster cast…"
		>
			{#snippet children(cast)}
				<TruncatedValue
					value={(
						cast.fid != null && cast.hash != null ?
							`FID ${String(cast.fid)} / ${cast.hash}`
						: 'username' in entityId && 'hashPrefix' in entityId ?
							`@${entityId.username} / ${entityId.hashPrefix}`
						: 'clientUrl' in entityId ?
							entityId.clientUrl
						:
							stringify(entityId)
					)}
					startLength={18}
					endLength={10}
					format={TruncatedValueFormat.Visual}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={cast}
			placeholderText="Loading Farcaster cast (author FID + cast hash)…"
		>
			{#snippet children(cast)}
				{@const castText = cast.text?.replaceAll('\n', ' ') ?? ''}
				<TruncatedValue
					value={(
						castText === '' ?
							'Cast'
						:
							castText
					)}
					startLength={56}
					endLength={24}
					format={TruncatedValueFormat.Abbr}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={cast}
			placeholderText="Loading Farcaster cast (author FID + cast hash)…"
		>
			{#snippet children(cast)}
				{#if variant === 'feed' && cast.$author?.username !== undefined}
					<span data-text="muted">
						@{cast.$author.username}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Immutable cast keyed by author FID and cast hash; thread, channel, and embed fields come from hub indexers.
		</p>
		<p>
			Engagement counts are off-chain snapshots—not consensus tallies or DEX quotes.
		</p>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			resource={cast}
			placeholderText="Loading Farcaster cast (author FID + cast hash)…"
		>
			{#snippet children(cast)}
				{@const flatText = cast.text?.replaceAll('\n', ' ') ?? ''}
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
						{cast.text ?? ''}
					</p>
				{/if}
			{/snippet}
		</ResourceBoundary>

		<dl>
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={cast}
						placeholderText="Loading Farcaster cast (author FID + cast hash)…"
					>
						{#snippet children(cast)}
							<Timestamp
								timestamp={cast.timestamp}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
			<ResourceBoundary
				resource={cast}
				placeholderText="Loading Farcaster cast (author FID + cast hash)…"
			>
				{#snippet children(cast)}
					<SocialMetricSnapshotRows
						metrics={[
							{
								label: 'Likes',
								value: cast.$$timestamps[0]?.likeCount ?? cast.likeCount,
							},
							{
								label: 'Recasts',
								value: cast.$$timestamps[0]?.recastCount ?? cast.recastCount,
							},
							{
								label: 'Replies',
								value: cast.$$timestamps[0]?.replyCount ?? cast.replyCount,
							},
						]}
					/>
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Channel</dt>
				<dd>
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
					<dt>Parent cast</dt>
					<dd>
						<ResourceBoundary
							resource={cast}
							placeholderText="Loading Farcaster cast (author FID + cast hash)…"
						>
							{#snippet children(cast)}
								{@const parentCastIdOpen = (
									cast.$parentCast === undefined ?
										undefined
									:
										cast.$parentCast[EntityMetaKey.Id]
								)}
								{@const parentCastHrefOpen = (
									parentCastIdOpen === undefined || !('fid' in parentCastIdOpen) || !('hash' in parentCastIdOpen) ?
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
			{/if}

			{#if open}
				<div>
					<dt>Parent URL</dt>
					<dd>
						<ResourceBoundary
							resource={cast}
							placeholderText="Loading Farcaster cast (author FID + cast hash)…"
						>
							{#snippet children(cast)}
								{#if cast.parentUrl !== undefined}
									<a href={cast.parentUrl}>{cast.parentUrl}</a>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Mentions</dt>
					<dd>
						<ResourceBoundary
							resource={cast}
							placeholderText="Loading Farcaster cast (author FID + cast hash)…"
						>
							{#snippet children(cast)}
								{#if (
									cast.mentions !== undefined
									&& cast.mentions.length
								)}
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
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Thread hash</dt>
					<dd>
						<ResourceBoundary
							resource={cast}
							placeholderText="Loading Farcaster cast (author FID + cast hash)…"
						>
							{#snippet children(cast)}
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
										return `0x${hex.toLowerCase()}`
									})()
								)}
								{@const warpcastThreadHrefOpen = (
									threadNormOpen !== undefined && threadNormOpen !== cast.hash ?
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
		<CollapsibleTabs
			id={`${castDetailKey}:carousel-cast`}
			sectionIdPrefix={castDetailKey}
			sections={collapsibleTabsSections([
				{ id: 'cast-record', label: 'Record' },
				{ id: 'cast-thread', label: 'Thread' },
				{ id: 'cast-media', label: 'Embeds' },
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
						Cast
					</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionCastRecord()}
				<ResourceBoundary
					resource={cast}
					placeholderText="Loading Farcaster cast (author FID + cast hash)…"
				>
					{#snippet children(cast)}
						<div data-column-item="center">
							<div>
								<dt>FID</dt>
								<dd>{String(cast.fid)}</dd>
							</div>

							<div>
								<dt>Hash</dt>
								<dd>
									<TruncatedValue
										value={cast.hash}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>
						</div>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionCastThread()}
				<ResourceBoundary
						resource={cast}
						placeholderText="Loading Farcaster cast (author FID + cast hash)…"
						>
							{#snippet children(cast)}
								{@const authorId = cast.$author?.[EntityMetaKey.Id]}
								{@const authorUsername = cast.$author?.username}
								{@const authorDisplayName = cast.$author?.displayName}
								{@const authorAvatarUrl = (
									cast.$author?.$icon === undefined ?
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
													{authorDisplayName ?? authorUsername ?? (
														authorId === undefined ?
															`FID ${String(cast.fid)}`
														:
															`FID ${String(authorId.fid)}`
													)}
												</strong>
												{#if (
													authorId !== undefined
													&& authorUsername !== undefined
												)}
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
										{cast.text ?? ''}
									</p>
								</section>
							{/snippet}
						</ResourceBoundary>
			{/snippet}

			{#snippet SectionCastMedia()}
				{#if open}
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

							{#if cast.$$embeds?.length}
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

												{#if embeddedCastId !== undefined && 'fid' in embeddedCastId && 'hash' in embeddedCastId}
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
								&& !cast.$$embeds?.length
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
		{/if}
	{/snippet}

			{#snippet SectionMetricSnapshots()}
				<FarcasterCast_TimestampsView
					entityFieldReference={{
						entityType: EntityType.FarcasterCast,
						entityId,
						fieldName: '$$timestamps',
					}}
					href={href ?? '#'}
					id={`${castDetailKey}:metric-snapshots`}
					title="Metric snapshots"
				/>
			{/snippet}
			</CollapsibleTabs>
		{/snippet}
	</EntityView>
