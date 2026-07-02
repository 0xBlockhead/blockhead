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
			selection: EntityProxyResource<typeof schema, EntityType.ZcashShieldedPool>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.ZcashShieldedPool>>
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

	const zcashShieldedPool = $derived(selection({
		fields: {
			noteProtocol: true,
			activationNetworkUpgrade: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).pool) ?? '')].filter(Boolean).join(' ') || 'Zcash shielded pool')
	const viewDomId = $derived('zcash-shielded-pool-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.ZcashShieldedPool}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/zcash/shielded-pool/[pool]', {
			networkSlug: String(({ ...selection.entitySelector, ...prefetched }).$network.slug),
			pool: String(({ ...selection.entitySelector, ...prefetched }).pool),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).pool) ?? '')].filter(Boolean).join(' ') || title || 'Zcash shielded pool'}
		{:else}
			<ResourceBoundary resource={zcashShieldedPool}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).pool) ?? '')].filter(Boolean).join(' ') || title || 'Zcash shielded pool'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.pool) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).noteProtocol) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).pool) ?? '')].filter(Boolean).join(' ') || title || 'Zcash shielded pool'}
		{:else}
			<ResourceBoundary resource={zcashShieldedPool}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).noteProtocol) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).pool) ?? '')].filter(Boolean).join(' ') || title || 'Zcash shielded pool'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.noteProtocol) ?? '')].filter(Boolean).join(' ') || [String((entity.pool) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const activationNetworkUpgrade0 = prefetched.activationNetworkUpgrade}
			{#if activationNetworkUpgrade0 !== undefined && activationNetworkUpgrade0 !== null}
				<span data-text="muted">
					{String((activationNetworkUpgrade0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={zcashShieldedPool}>
				{#snippet Pending()}
					{@const activationNetworkUpgrade0 = prefetched.activationNetworkUpgrade}
					{#if activationNetworkUpgrade0 !== undefined && activationNetworkUpgrade0 !== null}
						<span data-text="muted">
							{String((activationNetworkUpgrade0) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const activationNetworkUpgrade0 = entity.activationNetworkUpgrade}
					{#if activationNetworkUpgrade0 !== undefined && activationNetworkUpgrade0 !== null}
						<span data-text="muted">
							{String((activationNetworkUpgrade0) ?? '')}
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
