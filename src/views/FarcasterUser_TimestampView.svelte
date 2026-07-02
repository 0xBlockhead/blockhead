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
			selection: EntityProxyResource<typeof schema, EntityType.FarcasterUser_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.FarcasterUser_Timestamp>>
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

	const farcasterUserTimestamp = $derived(selection({
		sources: [
			Source.Snapchain_Rest,
			Source.Neynar_Rest,
		],
		fields: {
			followerCount: true,
			followingCount: true,
		},
	}))
	const titleFallback = $derived('Farcaster user observation')
	const viewDomId = $derived('farcaster-user-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterUser_Timestamp}
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
			<FarcasterUserView
				selection={select(EntityType.FarcasterUser, selection.entitySelector.$user)}
				layout={EntityLayout.Title}
				open={false}
			/>
		{:else}
			<ResourceBoundary resource={farcasterUserTimestamp}>
				{#snippet Pending()}
					<FarcasterUserView
						selection={select(EntityType.FarcasterUser, selection.entitySelector.$user)}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}

				{#snippet children(entity)}
					<FarcasterUserView
						selection={select(EntityType.FarcasterUser, selection.entitySelector.$user)}
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
			<ResourceBoundary resource={farcasterUserTimestamp}>
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
			<ResourceBoundary resource={farcasterUserTimestamp}>
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
			<ResourceBoundary resource={farcasterUserTimestamp}>
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
	{/snippet}
</EntityView>
