<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.XUser_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.XUser_Timestamp>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const xUserTimestamp = $derived(selection({
		sources: [
			Source.X_Rest,
			Source.X_FxEmbed_Rest,
		],
	}))
	const titleFallback = $derived('X user observation')
	const viewDomId = $derived('xuser-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import XUserView from '$/views/XUserView.svelte'
</script>


<EntityView
	entityType={EntityType.XUser_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.timestampMs !== undefined && pendingEntity.$user !== undefined && pendingEntity.$user.id !== undefined ? resolve('/x/user/[userId=stringSegment]/observations/[timestampMs=nonNegativeInteger]', {
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			userId: String(pendingEntity.$user.id ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={xUserTimestamp}>
			{#snippet Pending()}
				<XUserView
					selection={select(EntityType.XUser, selection.entitySelector.$user)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<XUserView
					selection={select(EntityType.XUser, selection.entitySelector.$user)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={xUserTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = pendingEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>User</dt>
				<dd>
					<XUserView
						selection={select(EntityType.XUser, selection.entitySelector.$user, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = pendingEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							followerCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const followerCount = pendingEntity.followerCount}
					{#if followerCount !== undefined && followerCount !== null}
						<div>
							<dt>Followers</dt>
							<dd>
								<NumberValue value={Number(followerCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const followerCount = resolvedEntity.followerCount}
					{#if followerCount !== undefined && followerCount !== null}
						<div>
							<dt>Followers</dt>
							<dd>
								<NumberValue value={Number(followerCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							followingCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const followingCount = pendingEntity.followingCount}
					{#if followingCount !== undefined && followingCount !== null}
						<div>
							<dt>Following</dt>
							<dd>
								<NumberValue value={Number(followingCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const followingCount = resolvedEntity.followingCount}
					{#if followingCount !== undefined && followingCount !== null}
						<div>
							<dt>Following</dt>
							<dd>
								<NumberValue value={Number(followingCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							tweetCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const tweetCount = pendingEntity.tweetCount}
					{#if tweetCount !== undefined && tweetCount !== null}
						<div>
							<dt>Tweets</dt>
							<dd>
								<NumberValue value={Number(tweetCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tweetCount = resolvedEntity.tweetCount}
					{#if tweetCount !== undefined && tweetCount !== null}
						<div>
							<dt>Tweets</dt>
							<dd>
								<NumberValue value={Number(tweetCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							listedCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const listedCount = pendingEntity.listedCount}
					{#if listedCount !== undefined && listedCount !== null}
						<div>
							<dt>Listed</dt>
							<dd>
								<NumberValue value={Number(listedCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const listedCount = resolvedEntity.listedCount}
					{#if listedCount !== undefined && listedCount !== null}
						<div>
							<dt>Listed</dt>
							<dd>
								<NumberValue value={Number(listedCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
