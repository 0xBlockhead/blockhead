<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.FarcasterChannel_Timestamp> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Farcaster_Rest,
			Source.Neynar_Rest,
		],
	}))
	const farcasterChannelTimestamp = $derived(viewSelection({
		fields: {
			name: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import FarcasterChannelView from '$/views/FarcasterChannelView.svelte'
	import FarcasterUserView from '$/views/FarcasterUserView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterChannel_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? ((prefetched.name ?? '') || 'Farcaster channel observation')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary resource={farcasterChannelTimestamp}>
			{#snippet children(entity)}
				{@const reference = entity.$icon}
				{#if reference != null}
					<MediaView
						selection={select(EntityType.Media, reference[EntityMetaKey.Selector])}
						prefetched={reference}
						layout={EntityLayout.Value}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary resource={farcasterChannelTimestamp}>
			{#snippet children(entity)}
				{@const name = entity.name}
				{#if name != null}
					{name}
				{/if}

				<FarcasterChannelView
					selection={select(EntityType.FarcasterChannel, selection.entitySelector.$channel)}
					href={null}
					layout={EntityLayout.Title}
				/>
			{/snippet}
		</ResourceBoundary>
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
				<dt>Channel</dt>
				<dd>
					<FarcasterChannelView
						selection={select(EntityType.FarcasterChannel, selection.entitySelector.$channel)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

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
					viewSelection({
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

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							memberCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const memberCount = entity.memberCount}
					{#if memberCount != null}
						<div>
							<dt>Members</dt>
							<dd>
								<NumberValue
									value={memberCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$moderator}
			>
				{#snippet children(farcasterUser)}
					{#if farcasterUser != null}
						{@const farcasterUserInitial = untrack(() => farcasterUser)}
						<div>
							<dt>Moderator</dt>
							<dd>
								<FarcasterUserView
									selection={select(EntityType.FarcasterUser, (farcasterUser ?? farcasterUserInitial)[EntityMetaKey.Selector])}
									prefetched={farcasterUser ?? farcasterUserInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							pinnedCastHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pinnedCastHash = entity.pinnedCastHash}
					{#if pinnedCastHash != null}
						<div>
							<dt>Pinned cast hash</dt>
							<dd>
								<TruncatedValue value={pinnedCastHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							publicCasting: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const publicCasting = entity.publicCasting}
					{#if publicCasting != null}
						<div>
							<dt>Public casting</dt>
							<dd>
								{publicCasting ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							externalLinkUrl: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const externalLinkUrl = entity.externalLinkUrl}
					{#if externalLinkUrl != null}
						<div>
							<dt>External link URL</dt>
							<dd>
								<TruncatedValue value={externalLinkUrl} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<ResourceBoundary
			resource={
				viewSelection({
					fields: {
						description: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{@const description = entity.description}
				{#if description != null && description !== ''}
					<p data-text="long-text">{description}</p>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
