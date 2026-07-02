<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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

	const cosmosDenom = $derived(selection({
		fields: {
			symbol: true,
			display: true,
			base: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).symbol) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).display) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).denom) ?? '')].filter(Boolean).join(' ') || 'Cosmos denom')
	const viewDomId = $derived('cosmos-denom-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CosmosDenom}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos/denom/[denom]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.reference)}`,
			denom: String(({ ...selection.entitySelector, ...prefetched }).denom),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).symbol) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).display) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).denom) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos denom'}
		{:else}
			<ResourceBoundary resource={cosmosDenom}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).symbol) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).display) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).denom) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos denom'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.symbol) ?? ''), String((entity.display) ?? ''), String((entity.denom) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).denom) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).symbol) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).display) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).denom) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos denom'}
		{:else}
			<ResourceBoundary resource={cosmosDenom}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).denom) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).symbol) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).display) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).denom) ?? '')].filter(Boolean).join(' ') || title || 'Cosmos denom'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.denom) ?? '')].filter(Boolean).join(' ') || [String((entity.symbol) ?? ''), String((entity.display) ?? ''), String((entity.denom) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<span data-text="muted">
				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
							caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
						}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
							networkSlug: String(selection.entitySelector.$network.slug),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			</span>
		{:else}
			<ResourceBoundary resource={cosmosDenom}>
				{#snippet Pending()}
					<span data-text="muted">
						<NetworkView
							selection={select(EntityType.Network, selection.entitySelector.$network)}
							href={
								(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
									caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
								}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
									networkSlug: String(selection.entitySelector.$network.slug),
								}) : undefined)
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}

				{#snippet children(entity)}
					<span data-text="muted">
						<NetworkView
							selection={select(EntityType.Network, selection.entitySelector.$network)}
							href={
								(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
									caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
								}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
									networkSlug: String(selection.entitySelector.$network.slug),
								}) : undefined)
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary resource={cosmosDenom}>
				{#snippet Pending()}
					{@const base = prefetched.base ?? selection.entitySelector.base}
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
					{@const base = entity.base ?? selection.entitySelector.base ?? prefetched.base}
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
		</dl>
	{/snippet}
</EntityView>
