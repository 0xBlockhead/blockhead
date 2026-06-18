<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { farcasterFeedKindByVariant } from '$/constants/Social/Farcaster.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = selector.variant === 'trending' ?
			resolve('/farcaster/feed/trending')
		: selector.variant === 'byUser' && 'fid' in selector ?
			resolve('/(social)/(farcaster)/farcaster/feed/user/[userId]', {
				userId: String(selector.fid),
	})
		: selector.variant === 'byChannel' && 'channelId' in selector ?
			resolve('/(social)/(farcaster)/farcaster/feed/channel/[channelId]', {
				channelId: selector.channelId,
	})
		:
			resolve('/farcaster/feed'),
				limit = 50,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.FarcasterFeed>
			href?: string
			limit?: number
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

	const feed = $derived(select(EntityType.FarcasterFeed, selector, ({ sources: [
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
				Source.Farcaster_Rest,
			], fields: { label: true } })))


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
	entitySelector={selector}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		{#if selector.variant === 'byUser' && 'fid' in selector}
			<span>
				FID {String(selector.fid)}
			</span>
		{:else if selector.variant === 'byChannel' && 'channelId' in selector}
			<TruncatedValue
				value={`/${selector.channelId}`}
				format={TruncatedValueFormat.Visual}
			/>
		{:else if selector.variant === 'following' && 'viewerFid' in selector}
			<span>
				FID {String(selector.viewerFid)}
			</span>
		{:else}
			<span>
				{farcasterFeedKindByVariant[selector.variant].label}
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
				: selector.variant === 'byUser' && 'fid' in selector ?
					`FID ${String(selector.fid)}`
				: selector.variant === 'byChannel' && 'channelId' in selector ?
					selector.channelId
				:
					farcasterFeedKindByVariant[selector.variant].label
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
		{@const feedDetailKey = stringify(selector)}
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
					selection={select(
			EntityType.FarcasterFeed,
			selector
		).$$entries}
					id={`${feedDetailKey}:entries`}
					{limit}
					title="Feed"
				/>
			{/snippet}
	</CollapsibleTabs>
	{/snippet}
</EntityView>
