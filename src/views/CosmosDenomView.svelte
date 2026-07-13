<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.CosmosDenom>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CosmosDenom>>
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
	const cosmosDenom = $derived(selection({
		fields: {
			symbol: true,
			display: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.symbol) ?? ''), String((pendingEntity.display) ?? ''), String((pendingEntity.denom) ?? '')].filter(Boolean).join(' ') || 'Cosmos denom')
	const viewDomId = $derived('cosmos-denom-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosDenom}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cosmosDenom}>
			{#snippet Pending()}
				{[String((pendingEntity.symbol) ?? ''), String((pendingEntity.display) ?? ''), String((pendingEntity.denom) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos denom'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.symbol) ?? ''), String((resolvedEntity.display) ?? ''), String((resolvedEntity.denom) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cosmosDenom}>
			{#snippet Pending()}
				{[String((pendingEntity.denom) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.symbol) ?? ''), String((pendingEntity.display) ?? ''), String((pendingEntity.denom) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos denom'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.denom) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.symbol) ?? ''), String((resolvedEntity.display) ?? ''), String((resolvedEntity.denom) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cosmosDenom}>
			{#snippet Pending()}
				<span data-text="muted">
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<span data-text="muted">
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Denom</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									denom: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const denom = pendingEntity.denom}
							{#if denom !== undefined && denom !== null}
								{String((denom) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const denom = resolvedEntity.denom}
							{#if denom !== undefined && denom !== null}
								{String((denom) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							display: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const display = pendingEntity.display}
					{#if display !== undefined && display !== null}
						<div>
							<dt>Display</dt>
							<dd>
								{String((display) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const display = resolvedEntity.display}
					{#if display !== undefined && display !== null}
						<div>
							<dt>Display</dt>
							<dd>
								{String((display) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							base: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const base = pendingEntity.base}
					{#if base !== undefined && base !== null}
						<div>
							<dt>Base</dt>
							<dd>
								{String((base) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const base = resolvedEntity.base}
					{#if base !== undefined && base !== null}
						<div>
							<dt>Base</dt>
							<dd>
								{String((base) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							symbol: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const symbol = pendingEntity.symbol}
					{#if symbol !== undefined && symbol !== null}
						<div>
							<dt>Symbol</dt>
							<dd>
								{String((symbol) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const symbol = resolvedEntity.symbol}
					{#if symbol !== undefined && symbol !== null}
						<div>
							<dt>Symbol</dt>
							<dd>
								{String((symbol) ?? '')}
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
