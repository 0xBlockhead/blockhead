<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
	}: WithRest<
		{
			selection: RegisteredEntityProxyResource<EntityType.FarcasterFeed>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.FarcasterFeed>
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const farcasterFeed = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			label: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			label: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.label) ?? ''), String((pendingEntity.variant) ?? '')].filter(Boolean).join(' ') || 'Farcaster feed')
	const viewDomId = $derived('farcaster-feed-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import FarcasterCastsView from '$/views/FarcasterCastsView.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterFeed}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector.variant === 'trending' ?
				resolve('/farcaster/feed/trending')
		:
				selection.entitySelector.variant === 'byUser'
				&& selection.entitySelector != null && 'fid' in selection.entitySelector
				&& selection.entitySelector.fid != null ?
					resolve('/farcaster/feed/user/[userId=farcasterFid]', {
				userId: String(selection.entitySelector.fid ?? ''),
			})
			:
					selection.entitySelector.variant === 'byChannel'
					&& selection.entitySelector != null && 'channelId' in selection.entitySelector
					&& selection.entitySelector.channelId != null ?
						resolve('/farcaster/feed/channel/[channelId=stringSegment]', {
					channelId: String(selection.entitySelector.channelId ?? ''),
				})
				:
						selection.entitySelector.variant === 'following'
						&& selection.entitySelector != null && 'viewerFid' in selection.entitySelector
						&& selection.entitySelector.viewerFid != null ?
							resolve('/farcaster/feed/following/[userId=farcasterFid]', {
						userId: String(selection.entitySelector.viewerFid ?? ''),
					})
					:
						undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'label')}
			{[String((pendingEntity.label) ?? ''), String((pendingEntity.variant) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={farcasterFeed}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.label) ?? ''), String((resolvedEntity.variant) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'label')}
			{[String((pendingEntity.variant) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.label) ?? ''), String((pendingEntity.variant) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={farcasterFeed}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.variant) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.label) ?? ''), String((resolvedEntity.variant) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Variant</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									variant: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const variant = resolvedEntity.variant}
							{#if variant !== undefined && variant !== null}
								{String((variant) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							fid: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fid = resolvedEntity.fid}
					{#if fid !== undefined && fid !== null}
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
				resource={
					selection({
						sources: selection.sources,
						fields: {
							channelId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const channelId = resolvedEntity.channelId}
					{#if channelId !== undefined && channelId !== null}
						<div>
							<dt>Channel ID</dt>
							<dd>
								{String((channelId) ?? '')}
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
						sources: selection.sources,
						fields: {
							viewerFid: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const viewerFid = resolvedEntity.viewerFid}
					{#if viewerFid !== undefined && viewerFid !== null}
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
				{@const farcasterFeedFarcasterCastsViewEntriesResource = selection
		.$$entries({
			sources: [
				Source.Neynar_Rest,
				Source.Snapchain_Rest,
			],
		})}
				<ResourceBoundary
					resource={farcasterFeedFarcasterCastsViewEntriesResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
						<FarcasterCastsView
							selection={farcasterFeedFarcasterCastsViewEntriesResource}
							countResource={farcasterFeedFarcasterCastsViewEntriesResource.count}
							title='Entries'
							href={resolve('/farcaster/feed/trending')}
							id='FarcasterCastsView-entries'
						/>
						{/if}
					{/snippet}
				</ResourceBoundary>
	{/snippet}
</EntityView>
