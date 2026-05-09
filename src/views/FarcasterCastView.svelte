<script lang="ts">
	// Types/constants
	import type { JsonValue } from '$/typescript/JsonValue.ts'
	import type { CastHash } from '$/schema/FarcasterCast.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityFieldValues, EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/routes/+layout.svelte'

	import { isEntityReferenceWithId } from '$/lib/isEntityReferenceWithId.ts'


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
		>
	> = $props()


	const isFeed = $derived(
		variant === 'feed',
	)

	const castIdKey = $derived(
		stringify(entityId),
	)

	const isCastHashStr = (value: JsonValue): value is CastHash => (
		typeof value === 'string'
		&& value.startsWith('0x')
	)

	const normalizeFarcasterCastHash = (hash: string): CastHash => {
		const t = hash.trim()
		const hex = (
			t.startsWith('0x')
			|| t.startsWith('0X') ?
				t.slice(2)
			:
				t
		)
		const out = `0x${hex.toLowerCase()}`
		if (!isCastHashStr(out)) {
			return '0x0'
		}
		return out
	}

	const castQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.FarcasterCast] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						castIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => castIdKey],
	)

	const castRow = $derived(
		castQuery.data?.[0]?.row,
	)

	type CastRefsEmbed = {
		url?: string
		embeddedCastId?: EntityId<typeof schema, EntityType.FarcasterCast>
		title?: string
		description?: string
		openGraphImageUrl?: string
		quotedPreviewText?: string
	}

	type CastRefsShape = {
		authorId: EntityId<typeof schema, EntityType.FarcasterUser> | undefined
		parentCastId: EntityId<typeof schema, EntityType.FarcasterCast> | undefined
		postedViaAppId: EntityId<typeof schema, EntityType.FarcasterUser> | undefined
		channelId: string | undefined
		embeds: CastRefsEmbed[]
	}

	const emptyCastRefs: CastRefsShape = {
		authorId: undefined,
		parentCastId: undefined,
		postedViaAppId: undefined,
		channelId: undefined,
		embeds: [],
	}

	const castRefs = $derived(
		(() => {
			const bagUnknown = castRow?.[EntityMetaKey.Fields]
			if (!(typeof bagUnknown === 'object' && bagUnknown !== null && !Array.isArray(bagUnknown))) {
				return emptyCastRefs
			}
			const b: Partial<EntityFieldValues<typeof schema, EntityType.FarcasterCast>> = bagUnknown
			const authorRef = b.$author
			const authorId = (
				isEntityReferenceWithId<EntityType.FarcasterUser>(authorRef) ?
					authorRef[EntityMetaKey.Id]
				:	undefined
			)
			const parentRef = b.$parentCast
			const parentCastId = (
				isEntityReferenceWithId<EntityType.FarcasterCast>(parentRef) ?
					parentRef[EntityMetaKey.Id]
				:	undefined
			)
			const postedViaRef = b.$postedViaApp
			const postedViaAppId = (
				isEntityReferenceWithId<EntityType.FarcasterUser>(postedViaRef) ?
					postedViaRef[EntityMetaKey.Id]
				:	undefined
			)
			const channelRef = b.$channel
			const channelId = (
				isEntityReferenceWithId<EntityType.FarcasterChannel>(channelRef) ?
					(
						typeof channelRef[EntityMetaKey.Id].id === 'string' ?
							channelRef[EntityMetaKey.Id].id
						:	undefined
					)
				:	undefined
			)
			const embedRefs = b.$$embeds
			const embeds = (
				Array.isArray(embedRefs) ?
					embedRefs.map((raw): CastRefsEmbed => {
						if (!(typeof raw === 'object' && raw !== null && !Array.isArray(raw))) {
							return {}
						}
						const e: Partial<EntityFieldValues<typeof schema, EntityType.FarcasterCastEmbed>> = raw
						const url = typeof e.url === 'string' && e.url.length ? e.url : undefined
						const emb = e.$embeddedCast
						const embeddedCastId = (
							isEntityReferenceWithId<EntityType.FarcasterCast>(emb) ?
								emb[EntityMetaKey.Id]
							:	undefined
						)
						return {
							url,
							embeddedCastId,
							title: typeof e.title === 'string' && e.title.length ? e.title : undefined,
							description: typeof e.description === 'string' && e.description.length ? e.description : undefined,
							openGraphImageUrl: e.$icon?.[EntityMetaKey.Id].url,
							quotedPreviewText: (
								typeof e.quotedPreviewText === 'string' && e.quotedPreviewText.length ?
									e.quotedPreviewText
								:	undefined
							),
						}
					})
				:	[]
			)
			return {
				authorId,
				parentCastId,
				postedViaAppId,
				channelId,
				embeds,
			}
		})(),
	)

	const authorLookupKey = $derived(
		castRefs.authorId === undefined ?
			'\u0000'
		:
			stringify(castRefs.authorId),
	)

	const authorQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.FarcasterUser] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						authorLookupKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => authorLookupKey],
	)

	const authorRow = $derived(
		authorQuery.data?.[0]?.row,
	)

	const authorField = $derived(
		(() => {
			const bagUnknown = authorRow?.[EntityMetaKey.Fields]
			if (!(typeof bagUnknown === 'object' && bagUnknown !== null && !Array.isArray(bagUnknown))) return null
			const b: Partial<EntityFieldValues<typeof schema, EntityType.FarcasterUser>> = bagUnknown
			const pick = (key: keyof typeof b) => {
				const x = b[key]
				return typeof x === 'string' && x.length ? x : undefined
			}
			return {
				username: pick('username'),
				displayName: pick('displayName'),
				avatarUrl: b.$icon?.[EntityMetaKey.Id].url,
			}
		})(),
	)

	const postedViaLookupKey = $derived(
		castRefs.postedViaAppId === undefined ?
			'\u0000'
		:	stringify(castRefs.postedViaAppId),
	)

	const postedViaAppQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.FarcasterUser] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						postedViaLookupKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => postedViaLookupKey],
	)

	const postedViaAppRow = $derived(
		postedViaAppQuery.data?.[0]?.row,
	)

	const postedViaAppField = $derived(
		(() => {
			const bagUnknown = postedViaAppRow?.[EntityMetaKey.Fields]
			if (!(typeof bagUnknown === 'object' && bagUnknown !== null && !Array.isArray(bagUnknown))) return null
			const b: Record<string, JsonValue> = bagUnknown
			const pick = (key: string) => {
				const x = b[key]
				return typeof x === 'string' && x.length ? x : undefined
			}
			return {
				username: pick('username'),
				displayName: pick('displayName'),
			}
		})(),
	)

	const castField = $derived(
		(() => {
			const bagUnknown = castRow?.[EntityMetaKey.Fields]
			if (!(typeof bagUnknown === 'object' && bagUnknown !== null && !Array.isArray(bagUnknown))) return null
			const b: Record<string, JsonValue> = bagUnknown
			const text = typeof b.text === 'string' ? b.text : undefined
			const timestamp = typeof b.timestamp === 'number' ? b.timestamp : undefined
			const parentUrl = typeof b.parentUrl === 'string' && b.parentUrl.length ? b.parentUrl : undefined
			const mentionsRaw = b.mentions
			const mentions = Array.isArray(mentionsRaw) ? mentionsRaw : undefined
			const likeCount = typeof b.likeCount === 'number' ? b.likeCount : undefined
			const recastCount = typeof b.recastCount === 'number' ? b.recastCount : undefined
			const replyCount = typeof b.replyCount === 'number' ? b.replyCount : undefined
			const threadHash = typeof b.threadHash === 'string' && b.threadHash.length ? b.threadHash : undefined
			const fidsRaw = b.mentionedProfileFids
			const mentionedProfileFids = (
				Array.isArray(fidsRaw) ?
					fidsRaw.filter((fid): fid is number => typeof fid === 'number')
				:	undefined
			)
			const chansRaw = b.mentionedChannelIds
			const mentionedChannelIds = (
				Array.isArray(chansRaw) ?
					chansRaw.filter((id): id is string => typeof id === 'string' && id.length > 0)
				:	undefined
			)
			return {
				text,
				timestamp,
				parentUrl,
				mentions,
				likeCount,
				recastCount,
				replyCount,
				threadHash,
				mentionedProfileFids,
				mentionedChannelIds,
			}
		})(),
	)

	const threadHashNormalized = $derived(
		castField?.threadHash === undefined ?
			undefined
		:	normalizeFarcasterCastHash(castField.threadHash),
	)

	const warpcastThreadHref = $derived(
		(
			threadHashNormalized !== undefined
			&& threadHashNormalized !== entityId.hash
		) ?
			`https://warpcast.com/~/conversations/${threadHashNormalized}`
		:	undefined,
	)

	const farcasterWebCastHref = $derived(
		authorField?.username !== undefined ?
			`https://farcaster.xyz/${authorField.username}/${entityId.hash}`
		:	undefined,
	)

	const channelPageHref = $derived(
		castRefs.channelId === undefined ?
			undefined
		:	resolve('/(social)/(farcaster)/farcaster/(channels)/channel/[channelId]', {
				channelId: castRefs.channelId,
			}),
	)

	const displayTitle = $derived(
		(() => {
			const t = castField?.text
			if (t === undefined || !t.trim()) {
				return 'Cast'
			}
			const line = t.trim().split('\n')[0] ?? ''
			const one = line.length > 88 ? `${line.slice(0, 85)}…` : line
			return one || 'Cast'
		})(),
	)

	const castTimestampMs = $derived(
		(() => {
			const t = castField?.timestamp
			if (t === undefined || typeof t !== 'number' || !Number.isFinite(t)) {
				return undefined
			}
			return t
		})(),
	)

	const parentCastHref = $derived(
		castRefs.parentCastId === undefined ?
			undefined
		:
			resolve('/(social)/(farcaster)/farcaster/(feed)/cast/[fid]/[hash]', {
				fid: String(castRefs.parentCastId.fid),
				hash: castRefs.parentCastId.hash,
			}),
	)

	const summaryBody = $derived(
		(() => {
			const t = castField?.text
			if (t === undefined || !t.trim()) return undefined
			const trimmed = t.trim()
			if (!isFeed) return trimmed
			const max = 200
			return trimmed.length <= max ? trimmed : `${trimmed.slice(0, max - 1)}…`
		})(),
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import Media from '$/components/Media.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import Timestamp, { TimestampFormat } from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterCast}
	{entityId}
	title={displayTitle}
	{href}
	{open}
	{...entityViewRest}
>
	{#snippet Icon()}
		{#if isFeed && authorField?.avatarUrl !== undefined}
			<IconComponent
				shape={IconShape.Circle}
				src={authorField.avatarUrl}
				alt=""
			/>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if isFeed && authorField?.username !== undefined}
			<span data-text="muted">
				@{authorField.username}
			</span>
		{/if}
	{/snippet}

	{#snippet Content()}
		<div data-column>
			{#if summaryBody !== undefined}
				<p>
					{summaryBody}
				</p>
			{/if}
			<dl>
				{#if castField?.timestamp !== undefined && typeof castField.timestamp === 'number' && Number.isFinite(castField.timestamp)}
					<div>
						<dt>Timestamp</dt>
						<dd>
							<Timestamp
								timestamp={castField.timestamp}
								format={TimestampFormat.Both}
							/>
						</dd>
					</div>
				{/if}
				{#if castField?.likeCount !== undefined}
					<div>
						<dt>Likes</dt>
						<dd>{String(castField.likeCount)}</dd>
					</div>
				{/if}
				{#if castField?.recastCount !== undefined}
					<div>
						<dt>Recasts</dt>
						<dd>{String(castField.recastCount)}</dd>
					</div>
				{/if}
				{#if castField?.replyCount !== undefined}
					<div>
						<dt>Replies</dt>
						<dd>{String(castField.replyCount)}</dd>
					</div>
				{/if}
				{#if channelPageHref !== undefined && castRefs.channelId !== undefined}
					<div>
						<dt>Channel</dt>
						<dd>
							<a href={channelPageHref}>
								/{castRefs.channelId}
							</a>
						</dd>
					</div>
				{/if}
			</dl>
		</div>
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
				<QueryBoundary
					query={castQuery}
				>

					{#snippet children(rows)}
					{#if rows?.[0]?.row === undefined}
						<p data-text="muted">
							No cast data yet.
						</p>
					{:else if castField == null}
						<p data-text="muted">
							FID {String(entityId.fid)} ·{' '}
							<span data-text="font-monospace">
								<TruncatedValue
									value={entityId.hash}
									startLength={10}
									endLength={8}
									format={TruncatedValueFormat.Visual}
								/>
							</span>
						</p>
					{:else}
						<section data-column>
							<header data-row="wrap gap-4">
								{#if authorField != null}
									<div data-row="inline wrap gap-2">
										{#if authorField.avatarUrl !== undefined}
											<IconComponent
												shape={IconShape.Circle}
												src={authorField.avatarUrl}
												alt=""
												size="2.5rem"
											/>
										{/if}
										<div data-column>
											<strong>
												{authorField.displayName ?? authorField.username ?? `FID ${String(castRefs.authorId?.fid ?? '')}`}
											</strong>
											{#if authorField.username !== undefined && castRefs.authorId !== undefined}
												<span data-text="muted">
													<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
														userId: String(castRefs.authorId.fid),
													})}>
														@{authorField.username}
													</a>
												</span>
											{/if}
										</div>
									</div>
								{:else if castRefs.authorId !== undefined}
									<p>
										<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
											userId: String(castRefs.authorId.fid),
										})}>
											Author FID {String(castRefs.authorId.fid)}
										</a>
									</p>
								{/if}
								{#if castTimestampMs !== undefined}
									<p data-text="muted">
										<Timestamp
											timestamp={castTimestampMs}
											format={TimestampFormat.Absolute}
										/>
									</p>
								{/if}
								{#if postedViaAppField != null && castRefs.postedViaAppId !== undefined}
									<p data-text="muted">
										Posted via{' '}
										<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
											userId: String(castRefs.postedViaAppId.fid),
										})}>
											{postedViaAppField.displayName ?? postedViaAppField.username ?? `FID ${String(castRefs.postedViaAppId.fid)}`}
										</a>
									</p>
								{:else if castRefs.postedViaAppId !== undefined}
									<p data-text="muted">
										Posted via{' '}
										<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
											userId: String(castRefs.postedViaAppId.fid),
										})}>
											FID {String(castRefs.postedViaAppId.fid)}
										</a>
									</p>
								{/if}
								{#if channelPageHref !== undefined && castRefs.channelId !== undefined}
									<p data-text="muted">
										<a href={channelPageHref}>
											/{castRefs.channelId}
										</a>
									</p>
								{/if}
							</header>

							{#if castField.text !== undefined}
								<p>
									{castField.text}
								</p>
							{/if}

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
								{#if castField.parentUrl !== undefined}
									<div>
										<dt>Parent URL</dt>
										<dd>
											<a href={castField.parentUrl}>{castField.parentUrl}</a>
										</dd>
									</div>
								{/if}
								{#if castField.mentions !== undefined && castField.mentions.length}
									<div>
										<dt>Mentions</dt>
										<dd>
											<ul data-row="wrap gap-2">
												{#each castField.mentions as mention (String(mention))}
													{#if typeof mention === 'number'}
														<li>
															<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
																userId: String(mention),
															})}>
																FID {String(mention)}
															</a>
														</li>
													{/if}
												{/each}
											</ul>
										</dd>
									</div>
								{/if}
								{#if castField.likeCount !== undefined}
									<div>
										<dt>Likes</dt>
										<dd>{String(castField.likeCount)}</dd>
									</div>
								{/if}
								{#if castField.recastCount !== undefined}
									<div>
										<dt>Recasts</dt>
										<dd>{String(castField.recastCount)}</dd>
									</div>
								{/if}
								{#if castField.replyCount !== undefined}
									<div>
										<dt>Replies</dt>
										<dd>{String(castField.replyCount)}</dd>
									</div>
								{/if}
								{#if channelPageHref !== undefined && castRefs.channelId !== undefined}
									<div>
										<dt>Channel</dt>
										<dd>
											<a href={channelPageHref}>
												/{castRefs.channelId}
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

							{#if castField.mentionedProfileFids !== undefined && castField.mentionedProfileFids.length}
								<section data-column>
									<h3>Mentioned profiles</h3>
									<ul data-row="wrap gap-2">
										{#each castField.mentionedProfileFids as mentionFid (String(mentionFid))}
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

							{#if castField.mentionedChannelIds !== undefined && castField.mentionedChannelIds.length}
								<section data-column>
									<h3>Mentioned channels</h3>
									<ul data-row="wrap gap-2">
										{#each castField.mentionedChannelIds as mentionChId (mentionChId)}
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

							{#if castRefs.embeds.length}
								<section data-column>
									<h3>Embeds</h3>
									<ul data-column>
										{#each castRefs.embeds as embed, embedIndex (String(embedIndex))}
											<li data-column>
												{#if embed.openGraphImageUrl !== undefined}
													<p>
														<a
															href={embed.url ?? embed.openGraphImageUrl}
															rel="noreferrer"
														>
															<Media
																media={{ url: embed.openGraphImageUrl }}
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
												{#if embed.embeddedCastId !== undefined && isCastHashStr(embed.embeddedCastId.hash)}
													<p>
														<a href={resolve('/(social)/(farcaster)/farcaster/(feed)/cast/[fid]/[hash]', {
															fid: String(embed.embeddedCastId.fid),
															hash: embed.embeddedCastId.hash,
														})}>
															Quoted cast · FID {String(embed.embeddedCastId.fid)} ·{' '}
															<span data-text="font-monospace">
																<TruncatedValue
																	value={embed.embeddedCastId.hash}
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
						</section>
					{/if}
					{/snippet}
				</QueryBoundary>
			</EntityDetails>
		{/if}
	{/snippet}
</EntityView>
