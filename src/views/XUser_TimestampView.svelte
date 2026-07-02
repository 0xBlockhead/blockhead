<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
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

	const xUserTimestamp = $derived(selection({
		sources: [
			Source.X_Rest,
			Source.X_FxEmbed_Rest,
		],
		fields: {
			followerCount: true,
			followingCount: true,
			tweetCount: true,
			listedCount: true,
		},
	}))
	const titleFallback = $derived('X user observation')
	const viewDomId = $derived('xuser-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import XUserView from '$/views/XUserView.svelte'
</script>


<EntityView
	entityType={EntityType.XUser_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<XUserView
				selection={select(EntityType.XUser, selection.entitySelector.$user)}
				layout={EntityLayout.Title}
				open={false}
			/>
		{:else}
			<ResourceBoundary resource={xUserTimestamp}>
				{#snippet Pending()}
					<XUserView
						selection={select(EntityType.XUser, selection.entitySelector.$user)}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}

				{#snippet children(entity)}
					<XUserView
						selection={select(EntityType.XUser, selection.entitySelector.$user)}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={xUserTimestamp}>
				{#snippet Pending()}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={xUserTimestamp}>
				{#snippet Pending()}
					{@const followerCount = prefetched.followerCount ?? selection.entitySelector.followerCount}
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
					{@const followerCount = entity.followerCount ?? selection.entitySelector.followerCount ?? prefetched.followerCount}
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
			<ResourceBoundary resource={xUserTimestamp}>
				{#snippet Pending()}
					{@const followingCount = prefetched.followingCount ?? selection.entitySelector.followingCount}
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
					{@const followingCount = entity.followingCount ?? selection.entitySelector.followingCount ?? prefetched.followingCount}
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
			<ResourceBoundary resource={xUserTimestamp}>
				{#snippet Pending()}
					{@const tweetCount = prefetched.tweetCount ?? selection.entitySelector.tweetCount}
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
					{@const tweetCount = entity.tweetCount ?? selection.entitySelector.tweetCount ?? prefetched.tweetCount}
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
			<ResourceBoundary resource={xUserTimestamp}>
				{#snippet Pending()}
					{@const listedCount = prefetched.listedCount ?? selection.entitySelector.listedCount}
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
					{@const listedCount = entity.listedCount ?? selection.entitySelector.listedCount ?? prefetched.listedCount}
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
