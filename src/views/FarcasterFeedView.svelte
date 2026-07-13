<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const farcasterFeed = $derived(selection({
		sources: [
			Source.Constants_Internal,
			Source.Farcaster_Rest,
			Source.Neynar_Rest,
		],
		fields: {
			label: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.label) ?? ''), String((pendingEntity.variant) ?? '')].filter(Boolean).join(' ') || 'Farcaster feed')
	const viewDomId = $derived('farcaster-feed-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.FarcasterFeed}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={farcasterFeed}>
			{#snippet Pending()}
				{[String((pendingEntity.label) ?? ''), String((pendingEntity.variant) ?? '')].filter(Boolean).join(' ') || title || 'Farcaster feed'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.label) ?? ''), String((resolvedEntity.variant) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={farcasterFeed}>
			{#snippet Pending()}
				{[String((pendingEntity.variant) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.label) ?? ''), String((pendingEntity.variant) ?? '')].filter(Boolean).join(' ') || title || 'Farcaster feed'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.variant) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.label) ?? ''), String((resolvedEntity.variant) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Variant</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									variant: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const variant = pendingEntity.variant}
							{#if variant !== undefined && variant !== null}
								{String((variant) ?? '')}
							{/if}
						{/snippet}

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
						fields: {
							fid: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const fid = pendingEntity.fid}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fid = resolvedEntity.fid}
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
			<ResourceBoundary
				resource={
					selection({
						fields: {
							channelId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const channelId = pendingEntity.channelId}
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
						fields: {
							viewerFid: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const viewerFid = pendingEntity.viewerFid}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const viewerFid = resolvedEntity.viewerFid}
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
