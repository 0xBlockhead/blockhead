<script lang="ts">
	// Types/constants
	import type { CastHash } from '$/schema/FarcasterCast.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import {
		type EntityId,
		schema,
	} from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/collections/$collections.ts'


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
			| 'Summary'
			| 'SummaryIcon'
			| 'SummaryHeadingAfter'
		>
	> = $props()


	const isFeed = $derived(
		variant === 'feed',
	)

	const castIdKey = $derived(
		stringify(entityId),
	)

	const isCastHashStr = (value: unknown): value is CastHash => (
		typeof value === 'string'
		&& value.startsWith('0x')
	)

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

	const castRefs = $derived(
		(() => {
			const bag = castRow?.[EntityMetaKey.Fields]
			if (bag == null || typeof bag !== 'object') {
				return {
					authorId: undefined as EntityId<typeof schema, EntityType.FarcasterUser> | undefined,
					parentCastId: undefined as EntityId<typeof schema, EntityType.FarcasterCast> | undefined,
					embeds: [] as {
						url?: string
						embeddedCastId?: EntityId<typeof schema, EntityType.FarcasterCast>
					}[],
				}
			}
			const b = bag as Record<string, unknown>
			const authorRef = b.$author
			const authorId = (
				authorRef != null
				&& typeof authorRef === 'object'
				&& EntityMetaKey.Id in authorRef ?
					(authorRef as { ['#id']: EntityId<typeof schema, EntityType.FarcasterUser> })[EntityMetaKey.Id]
				:
					undefined
			)
			const parentRef = b.$parentCast
			const parentCastId = (
				parentRef != null
				&& typeof parentRef === 'object'
				&& EntityMetaKey.Id in parentRef ?
					(parentRef as { ['#id']: EntityId<typeof schema, EntityType.FarcasterCast> })[EntityMetaKey.Id]
				:
					undefined
			)
			const embedRefs = b.$$embeds
			const embeds = (
				Array.isArray(embedRefs) ?
					embedRefs.map((raw) => {
						if (raw == null || typeof raw !== 'object') {
							return {}
						}
						const e = raw as Record<string, unknown>
						const url = typeof e.url === 'string' && e.url.length ? e.url : undefined
						const emb = e.$embeddedCast
						const embeddedCastId = (
							emb != null
							&& typeof emb === 'object'
							&& EntityMetaKey.Id in emb ?
								(emb as { ['#id']: EntityId<typeof schema, EntityType.FarcasterCast> })[EntityMetaKey.Id]
							:
								undefined
						)
						return {
							url,
							embeddedCastId,
						}
					})
				:
					[]
			)
			return {
				authorId,
				parentCastId,
				embeds,
			}
		})(),
	)

	const authorLookupKey = $derived(
		castRefs.authorId == null ?
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
			const bag = authorRow?.[EntityMetaKey.Fields]
			if (bag == null || typeof bag !== 'object') return null
			const b = bag as Record<string, unknown>
			const pick = (key: string) => {
				const x = Reflect.get(b, key)
				return typeof x === 'string' && x.length ? x : undefined
			}
			return {
				username: pick('username'),
				displayName: pick('displayName'),
				pfpUrl: pick('pfpUrl'),
			}
		})(),
	)

	const castField = $derived(
		(() => {
			const bag = castRow?.[EntityMetaKey.Fields]
			if (bag == null || typeof bag !== 'object') return null
			const b = bag as Record<string, unknown>
			const text = typeof b.text === 'string' ? b.text : undefined
			const timestamp = typeof b.timestamp === 'number' ? b.timestamp : undefined
			const parentUrl = typeof b.parentUrl === 'string' && b.parentUrl.length ? b.parentUrl : undefined
			const mentions = Array.isArray(b.mentions) ? b.mentions as unknown[] : undefined
			const likeCount = typeof b.likeCount === 'number' ? b.likeCount : undefined
			const recastCount = typeof b.recastCount === 'number' ? b.recastCount : undefined
			return {
				text,
				timestamp,
				parentUrl,
				mentions,
				likeCount,
				recastCount,
			}
		})(),
	)

	const displayTitle = $derived(
		(() => {
			const t = castField?.text
			if (t == null || !t.trim()) {
				return 'Cast'
			}
			const line = t.trim().split('\n')[0] ?? ''
			const one = line.length > 88 ? `${line.slice(0, 85)}…` : line
			return one || 'Cast'
		})(),
	)

	const timestampLabel = $derived(
		castField?.timestamp == null ?
			undefined
		:
			(
				castField.timestamp > 1e12 ?
					new Date(castField.timestamp).toISOString()
				:
					new Date(castField.timestamp * 1000).toISOString()
			),
	)

	const parentCastHref = $derived(
		castRefs.parentCastId == null ?
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
			if (t == null || !t.trim()) return undefined
			const trimmed = t.trim()
			if (!isFeed) return trimmed
			const max = 200
			return trimmed.length <= max ? trimmed : `${trimmed.slice(0, max - 1)}…`
		})(),
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import Icon, { IconShape } from '$/components/Icon.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
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
	{#snippet SummaryIcon()}
		{#if isFeed && authorField?.pfpUrl != null}
			<Icon
				shape={IconShape.Circle}
				src={authorField.pfpUrl}
				alt=""
			/>
		{/if}
	{/snippet}

	{#snippet SummaryHeadingAfter()}
		{#if isFeed && authorField?.username != null}
			<span data-text="muted">
				@{authorField.username}
			</span>
		{/if}
	{/snippet}

	{#snippet SummaryContent()}
		<div data-stack="tight">
			{#if summaryBody != null}
				<p>
					{summaryBody}
				</p>
			{/if}
			<dl data-definition-list="vertical">
				{#if timestampLabel != null}
					<div>
						<dt>Time</dt>
						<dd>{timestampLabel}</dd>
					</div>
				{/if}
				{#if castField?.likeCount != null}
					<div>
						<dt>Likes</dt>
						<dd>{String(castField.likeCount)}</dd>
					</div>
				{/if}
				{#if castField?.recastCount != null}
					<div>
						<dt>Recasts</dt>
						<dd>{String(castField.recastCount)}</dd>
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
					{#if rows?.[0]?.row == null}
						<p data-text="muted">
							No cast row in collections yet.
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
						<section data-stack="tight">
							<header data-row="wrap gap-4">
								{#if authorField != null}
									<div data-row="inline wrap gap-2">
										{#if authorField.pfpUrl != null}
											<Icon
												shape={IconShape.Circle}
												src={authorField.pfpUrl}
												alt=""
												size="2.5rem"
											/>
										{/if}
										<div data-stack="tight">
											<strong>
												{authorField.displayName ?? authorField.username ?? `FID ${String(castRefs.authorId?.fid ?? '')}`}
											</strong>
											{#if authorField.username != null && castRefs.authorId != null}
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
								{:else if castRefs.authorId != null}
									<p>
										<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
											userId: String(castRefs.authorId.fid),
										})}>
											Author FID {String(castRefs.authorId.fid)}
										</a>
									</p>
								{/if}
								{#if timestampLabel != null}
									<p data-text="muted">
										{timestampLabel}
									</p>
								{/if}
							</header>

							{#if castField.text != null}
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
								{#if parentCastHref != null}
									<div>
										<dt>Parent cast</dt>
										<dd>
											<a href={parentCastHref}>View parent</a>
										</dd>
									</div>
								{/if}
								{#if castField.parentUrl != null}
									<div>
										<dt>Parent URL</dt>
										<dd>
											<a href={castField.parentUrl}>{castField.parentUrl}</a>
										</dd>
									</div>
								{/if}
								{#if castField.mentions != null && castField.mentions.length}
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
								{#if castField.likeCount != null}
									<div>
										<dt>Likes</dt>
										<dd>{String(castField.likeCount)}</dd>
									</div>
								{/if}
								{#if castField.recastCount != null}
									<div>
										<dt>Recasts</dt>
										<dd>{String(castField.recastCount)}</dd>
									</div>
								{/if}
							</dl>

							{#if castRefs.embeds.length}
								<section data-stack="tight">
									<h3>Embeds</h3>
									<ul data-stack="tight">
										{#each castRefs.embeds as embed, embedIndex (String(embedIndex))}
											<li data-stack="tight">
												{#if embed.url != null}
													<p>
														<a
															href={embed.url}
															rel="noreferrer"
														>{embed.url}</a>
													</p>
												{/if}
												{#if embed.embeddedCastId != null && isCastHashStr(embed.embeddedCastId.hash)}
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
