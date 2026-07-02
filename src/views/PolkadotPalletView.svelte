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
			selection: EntityProxyResource<typeof schema, EntityType.PolkadotPallet>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.PolkadotPallet>>
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

	const polkadotPallet = $derived(selection({
		fields: {
			index: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).palletName) ?? '')].filter(Boolean).join(' ') || 'Polkadot pallet')
	const viewDomId = $derived('polkadot-pallet-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.PolkadotPallet}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/pallet/[palletName]', {
			networkSlug: String(({ ...selection.entitySelector, ...prefetched }).$network.slug),
			palletName: String(({ ...selection.entitySelector, ...prefetched }).palletName),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).palletName) ?? '')].filter(Boolean).join(' ') || title || 'Polkadot pallet'}
		{:else}
			<ResourceBoundary resource={polkadotPallet}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).palletName) ?? '')].filter(Boolean).join(' ') || title || 'Polkadot pallet'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.palletName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).palletName) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).palletName) ?? '')].filter(Boolean).join(' ') || title || 'Polkadot pallet'}
		{:else}
			<ResourceBoundary resource={polkadotPallet}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).palletName) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).palletName) ?? '')].filter(Boolean).join(' ') || title || 'Polkadot pallet'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.palletName) ?? '')].filter(Boolean).join(' ') || [String((entity.palletName) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const index0 = prefetched.index}
			{#if index0 !== undefined && index0 !== null}
				<span data-text="muted">
					{String((index0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={polkadotPallet}>
				{#snippet Pending()}
					{@const index0 = prefetched.index}
					{#if index0 !== undefined && index0 !== null}
						<span data-text="muted">
							{String((index0) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const index0 = entity.index}
					{#if index0 !== undefined && index0 !== null}
						<span data-text="muted">
							{String((index0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
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
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
