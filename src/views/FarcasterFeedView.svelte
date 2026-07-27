<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.FarcasterFeed> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
			Source.Farcaster_Rest,
			Source.Neynar_Rest,
		],
	}))
	const farcasterFeed = $derived(viewSelection({
		fields: {
			label: true,
			fid: true,
			channelId: true,
			viewerFid: true,
		},
	}))
	const titleFallback = $derived([(pendingEntity.label ?? ''), (pendingEntity.variant ?? '')].filter(Boolean).join(' ') || 'Farcaster feed')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import FarcasterCastsView from '$/views/FarcasterCastsView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterFeed}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector.variant === 'byUser'
			&& 'fid' in selection.entitySelector ?
				resolve(
					'/(social)/(farcaster)/farcaster/(farcasterNetwork)/feed/user/[userId=farcasterFid]',
					{
						userId: String(selection.entitySelector.fid),
					}
				)
			:
				selection.entitySelector.variant === 'byChannel'
				&& 'channelId' in selection.entitySelector ?
					resolve(
						'/(social)/(farcaster)/farcaster/(farcasterNetwork)/feed/channel/[channelId=stringSegment]',
						{
							channelId: String(selection.entitySelector.channelId),
						}
					)
				:
					selection.entitySelector.variant === 'following'
					&& 'viewerFid' in selection.entitySelector ?
						resolve(
							'/(social)/(farcaster)/farcaster/(farcasterNetwork)/feed/following/[userId=farcasterFid]',
							{
								userId: String(selection.entitySelector.viewerFid),
							}
						)
					:
						selection.entitySelector.variant === 'trending' ?
							resolve('/(social)/(farcaster)/farcaster/(farcasterNetwork)/feed/trending')
						:
							undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={farcasterFeed}>
			{#snippet children(entity)}
				{[entity.label, pendingEntity.variant].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{(pendingEntity.variant ?? '') || [(pendingEntity.label ?? ''), (pendingEntity.variant ?? '')].filter(Boolean).join(' ') || titleFallback}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Variant</dt>
				<dd>
					{pendingEntity.variant}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={farcasterFeed}
			>
				{#snippet children(entity)}
					{@const fid = entity.fid}
					{#if fid != null}
						<div>
							<dt>FID</dt>
							<dd>
								<NumberValue
									value={fid}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={farcasterFeed}
			>
				{#snippet children(entity)}
					{@const channelId = entity.channelId}
					{#if channelId != null}
						<div>
							<dt>Channel ID</dt>
							<dd>
								{channelId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={farcasterFeed}
			>
				{#snippet children(entity)}
					{@const viewerFid = entity.viewerFid}
					{#if viewerFid != null}
						<div>
							<dt>Viewer FID</dt>
							<dd>
								<NumberValue
									value={viewerFid}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const farcasterFeedFarcasterCastsViewEntriesResource = selection.$$entries}
		<ResourceBoundary
			resource={farcasterFeedFarcasterCastsViewEntriesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FarcasterCastsView
						selection={farcasterFeedFarcasterCastsViewEntriesResource}
						countResource={farcasterFeedFarcasterCastsViewEntriesResource.count}
						title='Entries'
						href={resolve('/(social)/(farcaster)/farcaster/(farcasterNetwork)/feed/trending')}
						id='entries'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
