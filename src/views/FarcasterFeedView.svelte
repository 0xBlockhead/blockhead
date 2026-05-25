<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { farcasterFeedKinds } from '$/constants/Social/Farcaster.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = entityId.variant === 'trending' ?
			resolve('/farcaster/feed/trending')
		: entityId.variant === 'byUser' ?
			resolve(`/farcaster/feed/user/${String(entityId.fid)}`)
		: entityId.variant === 'byChannel' ?
			resolve(`/farcaster/feed/channel/${encodeURIComponent(entityId.channelId)}`)
		:
			resolve('/farcaster/feed'),
				limit = 50,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.FarcasterFeed>
			href?: string
			limit?: number
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { mountEntityResolveLive } from '$/lib/db/resolveLive.svelte.ts'

	mountEntityResolveLive({
		entityType: EntityType.FarcasterFeed,
		entityId: () => entityId,
	})

	const feed = useEntity(
		EntityType.FarcasterFeed,
		entityId,
		{
			$: [
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
				Source.Farcaster_Rest,
			],
			label: {},
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import FarcasterCastsView from '$/views/FarcasterCastsView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterFeed}
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		{#if entityId.variant === 'byUser'}
			<span>
				{String(entityId.fid)}
			</span>
		{:else if entityId.variant === 'byChannel'}
			<TruncatedValue
				value={entityId.channelId}
				format={TruncatedValueFormat.Visual}
			/>
		{:else if entityId.variant === 'following'}
			<span>
				{String(entityId.viewerFid)}
			</span>
		{:else}
			<span>
				{farcasterFeedKinds[entityId.variant].label}
			</span>
		{/if}
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Feed variants scope cast streams: trending hub, one FID, one channel id, or a viewer’s following graph.
		</p>
		<p>
			Empty streams usually mean the indexer returned no hashes for that filter—not that Farcaster halted.
		</p>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={feed}
			placeholderText="Loading Farcaster feed (variant, FID or channel id, cast stream)…"
		>
			{#snippet children(loadedFeed)}
				{(
					feed.label != null
					&& feed.label !== ''
				) ?
					loadedFeed.label
				: entityId.variant === 'byUser' ?
					`FID ${String(entityId.fid)}`
				: entityId.variant === 'byChannel' ?
					entityId.channelId
				:
					farcasterFeedKinds[entityId.variant].label
				}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<dl>
			<div>
				<dt>Variant</dt>
				<dd>{farcasterFeedKinds[entityId.variant].label}</dd>
			</div>
			{#if entityId.variant === 'following'}
				<div>
					<dt>Viewer FID</dt>
					<dd>{String(entityId.viewerFid)}</dd>
				</div>
			{/if}

			{#if entityId.variant === 'byUser'}
				<div>
					<dt>Author FID</dt>
					<dd>{String(entityId.fid)}</dd>
				</div>
			{/if}

			{#if entityId.variant === 'byChannel'}
				<div>
					<dt>Channel id</dt>
					<dd>
						<TruncatedValue
							value={entityId.channelId}
							format={TruncatedValueFormat.Visual}
						/>
					</dd>
				</div>
			{/if}

			<div>
				<dt>Label</dt>
				<dd>
					<ResourceBoundary
						resource={feed}
						placeholderText="Loading Farcaster feed (variant, FID or channel id, cast stream)…"
					>
						{#snippet children(loadedFeed)}
							{#if loadedFeed.label != null && loadedFeed.label !== ''}
								{loadedFeed.label}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{@const feedDetailKey = stringify(entityId)}
		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${feedDetailKey}:carousel-feed`}
				sectionIdPrefix={feedDetailKey}
				sections={[
					{ id: 'feed-record', label: 'Record' },
					{ id: 'feed-entries', label: 'Casts' },
				]}
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
							Feed
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionFeedRecord({ id, label })}
					<EntityDetails
						entityType={EntityType.FarcasterFeed}
						{entityId}
					/>
				{/snippet}

				{#snippet SectionFeedEntries({ id, label })}
					<FarcasterCastsView
						href={resolve('/farcaster/feed')}
						entityFieldReference={{
							entityType: EntityType.FarcasterFeed,
							entityId,
							fieldName: '$$entries',
						}}
						id={`${feedDetailKey}:entries`}
						{limit}
						title="Feed"
					/>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>

