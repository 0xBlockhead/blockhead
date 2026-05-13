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


	// Context
	import { resolve } from '$app/paths'


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'

	import { useEntity } from '$/collections/$queries.svelte.ts'


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
		},
	)
</script>


<EntityView
	entityType={EntityType.FarcasterCast}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Heading()}
		<ResourceBoundary
			resource={castSummary}
			placeholderText="Loading cast…"
		>
			{#snippet children(row)}
				<HeadingComponent>
					<a {href}>
						<TruncatedValue
							value={(
								row.text.trim().replaceAll('\n', ' ')
								=== ''
							) ?
								'Cast'
							:
								row.text.trim().replaceAll('\n', ' ')
							}
							startLength={56}
							endLength={24}
							format={TruncatedValueFormat.Abbr}
						/>
					</a>
				</HeadingComponent>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Icon()}
		{#if variant === 'feed'}
			<ResourceBoundary
				resource={castSummary}
				placeholderText="Loading cast…"
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

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={castSummary}
			placeholderText="Loading cast…"
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
			placeholderText="Loading cast…"
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
				{@const flatText = row.text.trim().replaceAll('\n', ' ')}
				<div data-column>
					{#if flatText !== ''}
						<p>
							{#if variant === 'feed'}
								<TruncatedValue
									value={flatText}
									startLength={120}
									endLength={48}
									format={TruncatedValueFormat.Abbr}
								/>
							{:else}
								{row.text}
							{/if}
						</p>
					{/if}
					<dl>
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
						{#if channelPageHref !== undefined && channelId !== undefined}
							<div>
								<dt>Channel</dt>
								<dd>
									<a href={channelPageHref}>
										/{channelId}
									</a>
								</dd>
							</div>
						{/if}
					</dl>
				</div>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if children}
			{@render children()}
		{:else}
			<EntityDetails
				entityType={EntityType.FarcasterCast}
				{entityId}
			>
				<ResourceBoundary
					resource={castSummary}
					placeholderText="Loading cast…"
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
						{@const parentCastId = (
							row.$parentCast === undefined ?
								undefined
							:
								row.$parentCast[EntityMetaKey.Id]
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
						{@const threadNorm = (
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
								return `0x${hex.toLowerCase()}` as CastHash
							})()
						)}
						{@const warpcastThreadHref = (
							threadNorm !== undefined && threadNorm !== entityId.hash ?
								`https://warpcast.com/~/conversations/${threadNorm}`
							:
								undefined
						)}
						{@const farcasterWebCastHref = (
							authorUsername === undefined ?
								undefined
							:
								`https://farcaster.xyz/${authorUsername}/${entityId.hash}`
						)}
						{@const parentCastHref = (
							parentCastId === undefined ?
								undefined
							:
								resolve('/(social)/(farcaster)/farcaster/(feed)/cast/[fid]/[hash]', {
									fid: String(parentCastId.fid),
									hash: parentCastId.hash,
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
										Posted via{' '}
										<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
											userId: String(postedViaAppId.fid),
										})}>
											{postedViaDisplayName ?? postedViaUsername ?? `FID ${String(postedViaAppId.fid)}`}
										</a>
									</p>
								{/if}
								{#if channelPageHref !== undefined && channelId !== undefined}
									<p data-text="muted">
										<a href={channelPageHref}>
											/{channelId}
										</a>
									</p>
								{/if}
							</header>

							<p>
								{row.text}
							</p>

							<dl>
								<div>
									<dt>FID</dt>
									<dd>{String(entityId.fid)}</dd>
								</div>
								<div>
									<dt>Hash</dt>
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
								{#if parentCastHref !== undefined}
									<div>
										<dt>Parent cast</dt>
										<dd>
											<a href={parentCastHref}>View parent</a>
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
								{#if row.mentions !== undefined && row.mentions.length}
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
								{#if channelPageHref !== undefined && channelId !== undefined}
									<div>
										<dt>Channel</dt>
										<dd>
											<a href={channelPageHref}>
												/{channelId}
											</a>
										</dd>
									</div>
								{/if}
								{#if farcasterWebCastHref !== undefined}
									<div>
										<dt>On web</dt>
										<dd>
											<a
												href={farcasterWebCastHref}
												rel="noreferrer"
											>Open on Farcaster</a>
										</dd>
									</div>
								{/if}
								{#if warpcastThreadHref !== undefined}
									<div>
										<dt>Thread</dt>
										<dd>
											<a
												href={warpcastThreadHref}
												rel="noreferrer"
											>Open thread on Warpcast</a>
										</dd>
									</div>
								{/if}
							</dl>
						</section>
					{/snippet}
				</ResourceBoundary>
				<ResourceBoundary
					resource={castRich}
					placeholderText="Loading mentions and embeds…"
				>
					{#snippet children(rich)}
						<section data-column>
							{#if rich.mentionedProfileFids !== undefined && rich.mentionedProfileFids.length}
								<section data-column>
									<h3>Mentioned profiles</h3>
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
								(rich.mentionedProfileFids === undefined || rich.mentionedProfileFids.length === 0)
								&& (rich.mentionedChannelIds === undefined || rich.mentionedChannelIds.length === 0)
								&& rich.$$embeds.length === 0
							)}
								<p data-text="muted">
									No mentions or embeds available.
								</p>
							{/if}
						</section>
					{/snippet}
				</ResourceBoundary>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
