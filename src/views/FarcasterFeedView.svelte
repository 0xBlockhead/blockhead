<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { farcasterFeedKindByVariant } from '$/constants/Social/Farcaster.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { subscribe } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = entityId.variant === 'trending' ?
			resolve('/farcaster/feed/trending')
		: entityId.variant === 'byUser' ?
			resolve('/(social)/(farcaster)/farcaster/feed/user/[userId]', {
				userId: String(entityId.fid),
	})
		: entityId.variant === 'byChannel' ?
			resolve('/(social)/(farcaster)/farcaster/feed/channel/[channelId]', {
				channelId: entityId.channelId,
	})
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

	const feed = subscribe(EntityType.FarcasterFeed,
		entityId,
		({ sources: [
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
				Source.Farcaster_Rest,
			], fields: { label: true } }),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
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
				FID {String(entityId.fid)}
			</span>
		{:else if entityId.variant === 'byChannel'}
			<TruncatedValue
				value={`/${entityId.channelId}`}
				format={TruncatedValueFormat.Visual}
			/>
		{:else if entityId.variant === 'following'}
			<span>
				FID {String(entityId.viewerFid)}
			</span>
		{:else}
			<span>
				{farcasterFeedKindByVariant[entityId.variant].label}
			</span>
		{/if}
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={feed}
			placeholderText="Loading Farcaster feed (variant, FID or channel id, cast stream)…"
		>
			{#snippet children(feed)}
				{(
					feed.fields.label != null
					&& feed.fields.label !== ''
				) ?
					feed.fields.label
				: entityId.variant === 'byUser' ?
					`FID ${String(entityId.fid)}`
				: entityId.variant === 'byChannel' ?
					entityId.channelId
				:
					farcasterFeedKindByVariant[entityId.variant].label
				}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Feed variants scope cast streams: trending hub, one FID, one channel id, or a viewer’s following graph.
		</p>
		<p>
			Empty streams usually mean the indexer returned no hashes for that filter—not that Farcaster halted.
		</p>
	{/snippet}

	{#snippet Content({})}
		<dl>
			<div>
				<dt>Label</dt>
				<dd>
					<ResourceBoundary
						resource={feed}
						placeholderText="Loading Farcaster feed (variant, FID or channel id, cast stream)…"
					>
						{#snippet children(feed)}
							{#if feed.fields.label != null && feed.fields.label !== ''}
								{feed.fields.label}
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
		<CollapsibleTabs
			id={`${feedDetailKey}:carousel-feed`}
			sectionIdPrefix={feedDetailKey}
			sections={[
				{ id: 'feed-record', label: 'Record' },
				{ id: 'feed-entries', label: 'Casts' },
			]}
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
						Feed
					</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionFeedRecord({ id, label })}
			{/snippet}

			{#snippet SectionFeedEntries({ id, label })}
				<FarcasterCastsView
					CollapsibleProps={{ canToggle: false }}
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
	{/snippet}
</EntityView>
