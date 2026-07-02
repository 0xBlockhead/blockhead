<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.FarcasterFeed>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.FarcasterFeed>>
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

	const farcasterFeed = $derived(selection({
		sources: [
			Source.Constants_Internal,
			Source.Farcaster_Rest,
			Source.Neynar_Rest,
		],
		fields: {
			label: true,
			...(open && {
				$$entries: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).label) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).variant) ?? '')].filter(Boolean).join(' ') || 'Farcaster feed')
	const viewDomId = $derived('farcaster-feed-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterFeed}
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
			{[String((({ ...selection.entitySelector, ...prefetched }).label) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).variant) ?? '')].filter(Boolean).join(' ') || title || 'Farcaster feed'}
		{:else}
			<ResourceBoundary resource={farcasterFeed}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).label) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).variant) ?? '')].filter(Boolean).join(' ') || title || 'Farcaster feed'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.label) ?? ''), String((entity.variant) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).variant) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).label) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).variant) ?? '')].filter(Boolean).join(' ') || title || 'Farcaster feed'}
		{:else}
			<ResourceBoundary resource={farcasterFeed}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).variant) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).label) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).variant) ?? '')].filter(Boolean).join(' ') || title || 'Farcaster feed'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.variant) ?? '')].filter(Boolean).join(' ') || [String((entity.label) ?? ''), String((entity.variant) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={farcasterFeed}>
				{#snippet Pending()}
					{@const fid = prefetched.fid ?? selection.entitySelector.fid}
					{#if fid !== undefined && fid !== null}
						<div>
							<dt>FID</dt>
							<dd>
								<NumberValue value={Number(fid)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const fid = entity.fid ?? selection.entitySelector.fid ?? prefetched.fid}
					{#if fid !== undefined && fid !== null}
						<div>
							<dt>FID</dt>
							<dd>
								<NumberValue value={Number(fid)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={farcasterFeed}>
				{#snippet Pending()}
					{@const channelId = prefetched.channelId ?? selection.entitySelector.channelId}
					{#if channelId !== undefined && channelId !== null}
						<div>
							<dt>Channel ID</dt>
							<dd>
								{String((channelId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const channelId = entity.channelId ?? selection.entitySelector.channelId ?? prefetched.channelId}
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
			<ResourceBoundary resource={farcasterFeed}>
				{#snippet Pending()}
					{@const viewerFid = prefetched.viewerFid ?? selection.entitySelector.viewerFid}
					{#if viewerFid !== undefined && viewerFid !== null}
						<div>
							<dt>Viewer FID</dt>
							<dd>
								<NumberValue value={Number(viewerFid)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const viewerFid = entity.viewerFid ?? selection.entitySelector.viewerFid ?? prefetched.viewerFid}
					{#if viewerFid !== undefined && viewerFid !== null}
						<div>
							<dt>Viewer FID</dt>
							<dd>
								<NumberValue value={Number(viewerFid)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
