<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { resolve } from '$app/paths'
	import { type EntityId, schema } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'


	// State
	import { eq, useLiveQuery } from '@tanstack/svelte-db'
	import { stringify } from 'devalue'

	import { entityCollectionByEntityType } from '$/collections/$collections.ts'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
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
			| 'Summary'
			| 'SummaryIcon'
		>
	> = $props()


	const refUserFid = (ref: unknown) => (
		ref != null
		&& typeof ref === 'object'
		&& EntityMetaKey.Id in ref
		&& typeof (ref as { ['#id']?: { fid?: unknown } })[EntityMetaKey.Id] === 'object'
		&& (ref as { ['#id']: { fid?: unknown } })[EntityMetaKey.Id] != null
		&& typeof (ref as { ['#id']: { fid: number } })[EntityMetaKey.Id].fid === 'number' ?
			(ref as { ['#id']: { fid: number } })[EntityMetaKey.Id].fid
		:
			undefined
	)

	const channelIdKey = $derived(
		stringify(entityId),
	)

	const channelQuery = useLiveQuery(
		(queryBuilder) => (
			queryBuilder
				.from({ row: entityCollectionByEntityType[EntityType.FarcasterChannel] })
				.where(({ row }) => (
					eq(
						row[EntityMetaKey.IdKey],
						channelIdKey,
					)
				))
				.select(({ row }) => ({ row }))
		),
		[() => channelIdKey],
	)

	const channelRow = $derived(
		channelQuery.data?.[0]?.row,
	)

	const channelField = $derived(
		(() => {
			const bag = channelRow?.[EntityMetaKey.Fields]
			if (bag == null || typeof bag !== 'object') return null
			const b = bag as Record<string, unknown>
			const moderatorsRaw = b.$$moderators
			const moderators = (
				Array.isArray(moderatorsRaw) ?
					moderatorsRaw
						.map((ref) => refUserFid(ref))
						.filter((fid): fid is number => typeof fid === 'number')
				:
					undefined
			)
			return {
				name: typeof b.name === 'string' ? b.name : undefined,
				url: typeof b.url === 'string' ? b.url : undefined,
				description: typeof b.description === 'string' ? b.description : undefined,
				imageUrl: typeof b.imageUrl === 'string' ? b.imageUrl : undefined,
				headerImageUrl: typeof b.headerImageUrl === 'string' ? b.headerImageUrl : undefined,
				createdAt: typeof b.createdAt === 'number' ? b.createdAt : undefined,
				followerCount: typeof b.followerCount === 'number' ? b.followerCount : undefined,
				memberCount: typeof b.memberCount === 'number' ? b.memberCount : undefined,
				pinnedCastHash: typeof b.pinnedCastHash === 'string' ? b.pinnedCastHash : undefined,
				publicCasting: typeof b.publicCasting === 'boolean' ? b.publicCasting : undefined,
				externalLinkTitle: typeof b.externalLinkTitle === 'string' ? b.externalLinkTitle : undefined,
				externalLinkUrl: typeof b.externalLinkUrl === 'string' ? b.externalLinkUrl : undefined,
				followedAt: typeof b.followedAt === 'number' ? b.followedAt : undefined,
				leadFid: refUserFid(b.$lead),
				moderatorFid: refUserFid(b.$moderator),
				moderatorFids: moderators,
			}
		})(),
	)

	const displayTitle = $derived(
		channelField?.name ?? entityId.id,
	)

	const createdAtLabel = $derived(
		channelField?.createdAt == null ?
			undefined
		:
			new Date(
				channelField.createdAt > 1e12 ?
					channelField.createdAt
				:
					channelField.createdAt * 1000,
			).toISOString(),
	)

	const followedAtLabel = $derived(
		channelField?.followedAt == null ?
			undefined
		:
			new Date(
				channelField.followedAt > 1e12 ?
					channelField.followedAt
				:
					channelField.followedAt * 1000,
			).toISOString(),
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import QueryBoundary from '$/components/QueryBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import FarcasterCastsView from '$/views/FarcasterCastsView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterChannel}
	{entityId}
	{href}
	{open}
	{...entityViewRest}
	title={displayTitle}
>
	{#snippet SummaryContent()}
		<div data-stack="tight">
			{#if channelField?.headerImageUrl != null}
				<p>
					<img
						src={channelField.headerImageUrl}
						alt=""
						data-fit="cover"
					/>
				</p>
			{/if}
			<dl data-definition-list="vertical">
				<div>
					<dt>Channel id</dt>
					<dd>{entityId.id}</dd>
				</div>
				{#if channelField?.followerCount != null}
					<div>
						<dt>Followers</dt>
						<dd>{String(channelField.followerCount)}</dd>
					</div>
				{/if}
				{#if channelField?.memberCount != null}
					<div>
						<dt>Members</dt>
						<dd>{String(channelField.memberCount)}</dd>
					</div>
				{/if}
				{#if channelField?.publicCasting != null}
					<div>
						<dt>Public casting</dt>
						<dd>{channelField.publicCasting ? 'Yes' : 'No'}</dd>
					</div>
				{/if}
			</dl>
			{#if channelField?.description != null}
				<p data-text="muted">
					{channelField.description}
				</p>
			{/if}
		</div>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.FarcasterChannel}
			{entityId}
		>
			<QueryBoundary
				query={channelQuery}
			>

				{#snippet children(rows)}
					{#if rows?.[0]?.row == null}
						<p data-text="muted">
							No channel row in collections yet (no resolver for this channel id).
						</p>
					{:else if channelField == null}
						<p data-text="muted">
							{entityId.id}
						</p>
					{:else}
						<section data-stack="tight">
							<h3>Channel</h3>
							{#if channelField.headerImageUrl != null}
								<p>
									<img
										src={channelField.headerImageUrl}
										alt=""
										data-fit="cover"
									/>
								</p>
							{/if}
							<dl>
								{#if channelField.name != null}
									<div>
										<dt>Name</dt>
										<dd>{channelField.name}</dd>
									</div>
								{/if}
								<div>
									<dt>Channel id</dt>
									<dd>{entityId.id}</dd>
								</div>
								{#if channelField.url != null}
									<div>
										<dt>URL</dt>
										<dd>
											<a href={channelField.url}>{channelField.url}</a>
										</dd>
									</div>
								{/if}
								{#if channelField.description != null}
									<div>
										<dt>Description</dt>
										<dd>{channelField.description}</dd>
									</div>
								{/if}
								{#if channelField.imageUrl != null}
									<div>
										<dt>Image</dt>
										<dd>
											<a href={channelField.imageUrl}>{channelField.imageUrl}</a>
										</dd>
									</div>
								{/if}
								{#if channelField.leadFid != null}
									<div>
										<dt>Lead</dt>
										<dd>
											<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
												userId: String(channelField.leadFid),
											})}>
												FID {String(channelField.leadFid)}
											</a>
										</dd>
									</div>
								{/if}
								{#if channelField.moderatorFid != null}
									<div>
										<dt>Moderator</dt>
										<dd>
											<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
												userId: String(channelField.moderatorFid),
											})}>
												FID {String(channelField.moderatorFid)}
											</a>
										</dd>
									</div>
								{/if}
								{#if channelField.moderatorFids != null && channelField.moderatorFids.length}
									<div>
										<dt>Moderators</dt>
										<dd>
											<ul>
												{#each channelField.moderatorFids as fid (fid)}
													<li>
														<a href={resolve('/(social)/(farcaster)/farcaster/(users)/user/[userId]', {
															userId: String(fid),
														})}>
															FID {String(fid)}
														</a>
													</li>
												{/each}
											</ul>
										</dd>
									</div>
								{/if}
								{#if createdAtLabel != null}
									<div>
										<dt>Created</dt>
										<dd>{createdAtLabel}</dd>
									</div>
								{/if}
								{#if channelField.pinnedCastHash != null}
									<div>
										<dt>Pinned cast</dt>
										<dd>
											<span data-text="font-monospace">
												<TruncatedValue
													value={channelField.pinnedCastHash}
													startLength={10}
													endLength={8}
													format={TruncatedValueFormat.Visual}
												/>
											</span>
										</dd>
									</div>
								{/if}
								{#if channelField.publicCasting != null}
									<div>
										<dt>Public casting</dt>
										<dd>{channelField.publicCasting ? 'Yes' : 'No'}</dd>
									</div>
								{/if}
								{#if channelField.externalLinkUrl != null}
									<div>
										<dt>External link</dt>
										<dd>
											<a href={channelField.externalLinkUrl}>
												{channelField.externalLinkTitle ?? channelField.externalLinkUrl}
											</a>
										</dd>
									</div>
								{/if}
								{#if followedAtLabel != null}
									<div>
										<dt>Followed at</dt>
										<dd>{followedAtLabel}</dd>
									</div>
								{/if}
								{#if channelField.followerCount != null}
									<div>
										<dt>Followers</dt>
										<dd>{String(channelField.followerCount)}</dd>
									</div>
								{/if}
								{#if channelField.memberCount != null}
									<div>
										<dt>Members</dt>
										<dd>{String(channelField.memberCount)}</dd>
									</div>
								{/if}
							</dl>
						</section>
					{/if}
				{/snippet}
			</QueryBoundary>
		</EntityDetails>

		<FarcasterCastsView
			href={resolve('/farcaster/feed')}
			id={`${channelIdKey}:casts`}
			open={false}
			parentEntityType={EntityType.FarcasterChannel}
			parentEntityId={entityId}
			title="Casts"
		/>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
