<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
		selection,
		href = selection.entitySelector.variant === 'trending' ?
			resolve('/farcaster/feed/trending')
		: selection.entitySelector.variant === 'byUser' && 'fid' in selection.entitySelector ?
				resolve('/(social)/(farcaster)/farcaster/feed/user/[userId=farcasterFid]', {
				userId: String(selection.entitySelector.fid),
	})
		: selection.entitySelector.variant === 'byChannel' && 'channelId' in selection.entitySelector ?
			resolve('/(social)/(farcaster)/farcaster/feed/channel/[channelId]', {
				channelId: selection.entitySelector.channelId,
	})
		:
			resolve('/farcaster/feed'),
				limit = 50,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.FarcasterFeed>
			href?: string
			limit?: number
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	const feed = $derived(selection( { sources: [
				Source.Snapchain_Rest,
				Source.Farcaster_Rest,
			], fields: { label: true } }))


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
	entitySelector={selection.entitySelector}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		{#if selection.entitySelector.variant === 'byUser' && 'fid' in selection.entitySelector}
			<span>
				FID {String(selection.entitySelector.fid)}
			</span>
		{:else if selection.entitySelector.variant === 'byChannel' && 'channelId' in selection.entitySelector}
			<TruncatedValue
				value={`/${selection.entitySelector.channelId}`}
				format={TruncatedValueFormat.Visual}
			/>
		{:else if selection.entitySelector.variant === 'following' && 'viewerFid' in selection.entitySelector}
			<span>
				FID {String(selection.entitySelector.viewerFid)}
			</span>
		{:else}
			<span>
				{farcasterFeedKindByVariant[selection.entitySelector.variant].label}
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
					feed.label != null
					&& feed.label !== ''
				) ?
					feed.label
				: selection.entitySelector.variant === 'byUser' && 'fid' in selection.entitySelector ?
					`FID ${String(selection.entitySelector.fid)}`
				: selection.entitySelector.variant === 'byChannel' && 'channelId' in selection.entitySelector ?
					selection.entitySelector.channelId
				:
					farcasterFeedKindByVariant[selection.entitySelector.variant].label
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
							{#if feed.label != null && feed.label !== ''}
								{feed.label}
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
		{@const feedDetailKey = stringify(selection.entitySelector)}
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

			{#snippet SectionFeedEntries({ id, label })}
				<FarcasterCastsView
					CollapsibleProps={{ canToggle: false }}
					href={resolve('/farcaster/feed')}
					selection={selection.$$entries}
					id={`${feedDetailKey}:entries`}
					{limit}
					title="Feed"
				/>
			{/snippet}
	</CollapsibleTabs>
	{/snippet}
</EntityView>
