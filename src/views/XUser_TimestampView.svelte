<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.XUser_Timestamp>, 'prefetched'> = $props()


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import XUserView from '$/views/XUserView.svelte'
</script>


<EntityView
	entityType={EntityType.XUser_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'X user observation'}
	href={
		href === undefined ?
			(
				'id' in selection.entitySelector.$user ?
					resolve(
						'/(social)/(x)/x/(xNetwork)/user/[userId=stringSegment]/(xUser)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
						{
							userId: selection.entitySelector.$user.id,
							timestampMs: String(selection.entitySelector.timestampMs),
							source: selection.entitySelector.source,
						}
					)
				:
					undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<XUserView
			selection={select(EntityType.XUser, selection.entitySelector.$user)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>User</dt>
				<dd>
					<XUserView
						selection={select(EntityType.XUser, selection.entitySelector.$user)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
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
				{#snippet children(entity)}
					{@const followerCount = entity.followerCount}
					{#if followerCount != null}
						<div>
							<dt>Followers</dt>
							<dd>
								<NumberValue
									value={followerCount}
								/>
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
				{#snippet children(entity)}
					{@const followingCount = entity.followingCount}
					{#if followingCount != null}
						<div>
							<dt>Following</dt>
							<dd>
								<NumberValue
									value={followingCount}
								/>
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
				{#snippet children(entity)}
					{@const tweetCount = entity.tweetCount}
					{#if tweetCount != null}
						<div>
							<dt>Tweets</dt>
							<dd>
								<NumberValue
									value={tweetCount}
								/>
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
				{#snippet children(entity)}
					{@const listedCount = entity.listedCount}
					{#if listedCount != null}
						<div>
							<dt>Listed</dt>
							<dd>
								<NumberValue
									value={listedCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
