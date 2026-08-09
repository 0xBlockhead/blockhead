<!-- Generated from APP.ts. -->

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

	const farcasterFeed = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
			Source.Farcaster_Rest,
			Source.Neynar_Rest,
		],
		fields: {
			label: true,
			fid: true,
			channelId: true,
			viewerFid: true,
		},
	}))
	const titleFallback = $derived([(prefetched.label ?? ''), selection.entitySelector.variant].filter(Boolean).join(' ') || 'Farcaster feed')


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
		href === undefined ?
			(
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
								channelId: selection.entitySelector.channelId,
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
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={farcasterFeed}>
			{#snippet children(entity)}
				{[entity.label, selection.entitySelector.variant].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.variant || [(prefetched.label ?? ''), selection.entitySelector.variant].filter(Boolean).join(' ') || titleFallback}
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Variant</dt>
				<dd>
					{selection.entitySelector.variant}
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

	{#snippet Details()}
		{@const entriesResource = selection.$$entries}
		<ResourceBoundary
			resource={entriesResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FarcasterCastsView
						selection={entriesResource}
						countResource={entriesResource.count}
						title='Entries'
						href={
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
											channelId: selection.entitySelector.channelId,
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
						}
						id='entries'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
