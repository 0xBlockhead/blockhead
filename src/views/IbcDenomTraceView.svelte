<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


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
			selection: RegisteredEntityProxyResource<EntityType.IbcDenomTrace>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.IbcDenomTrace>>
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
	const ibcDenomTrace = $derived(selection({
		sources: selection.sources,
		fields: {
			displayDenom: true,
			baseDenom: true,
			denomHash: true,
			sourceChannel: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.displayDenom) ?? ''), String((pendingEntity.baseDenom) ?? ''), String((pendingEntity.traceKey) ?? '')].filter(Boolean).join(' ') || 'IBC denom trace')
	const viewDomId = $derived('ibc-denom-trace-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.IbcDenomTrace}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.displayDenom) ?? ''), String((pendingEntity.baseDenom) ?? ''), String((pendingEntity.traceKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={ibcDenomTrace}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.displayDenom) ?? ''), String((resolvedEntity.baseDenom) ?? ''), String((resolvedEntity.traceKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.denomHash) ?? ''), String((pendingEntity.traceKey) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.displayDenom) ?? ''), String((pendingEntity.baseDenom) ?? ''), String((pendingEntity.traceKey) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={ibcDenomTrace}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.denomHash) ?? ''), String((resolvedEntity.traceKey) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.displayDenom) ?? ''), String((resolvedEntity.baseDenom) ?? ''), String((resolvedEntity.traceKey) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const sourceChannel0 = pendingEntity.sourceChannel}
			{#if sourceChannel0 !== undefined && sourceChannel0 !== null}
				<span data-text="muted">
					{String((sourceChannel0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={ibcDenomTrace}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceChannel0 = resolvedEntity.sourceChannel}
					{#if sourceChannel0 !== undefined && sourceChannel0 !== null}
						<span data-text="muted">
							{String((sourceChannel0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Trace key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									traceKey: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const traceKey = resolvedEntity.traceKey}
							{#if traceKey !== undefined && traceKey !== null}
								<TruncatedValue value={String((traceKey) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							denomHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const denomHash = resolvedEntity.denomHash}
					{#if denomHash !== undefined && denomHash !== null}
						<div>
							<dt>Denom hash</dt>
							<dd>
								<TruncatedValue value={String((denomHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							path: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const path = resolvedEntity.path}
					{#if path !== undefined && path !== null}
						<div>
							<dt>Path</dt>
							<dd>
								{String((path) ?? '')}
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
							baseDenom: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const baseDenom = resolvedEntity.baseDenom}
					{#if baseDenom !== undefined && baseDenom !== null}
						<div>
							<dt>Base denom</dt>
							<dd>
								{String((baseDenom) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							displayDenom: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const displayDenom = resolvedEntity.displayDenom}
					{#if displayDenom !== undefined && displayDenom !== null}
						<div>
							<dt>Display denom</dt>
							<dd>
								{String((displayDenom) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							sourcePort: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourcePort = resolvedEntity.sourcePort}
					{#if sourcePort !== undefined && sourcePort !== null}
						<div>
							<dt>Source port</dt>
							<dd>
								{String((sourcePort) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							sourceChannel: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceChannel = resolvedEntity.sourceChannel}
					{#if sourceChannel !== undefined && sourceChannel !== null}
						<div>
							<dt>Source channel</dt>
							<dd>
								{String((sourceChannel) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
