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
	import { UrlString } from '$/schema/UrlString.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.EvmNetworkBridge>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmNetworkBridge>>
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

	const evmNetworkBridge = $derived(selection({
		fields: {
			relationshipType: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).url) ?? '')].filter(Boolean).join(' ') || 'EVM network bridge')
	const viewDomId = $derived('evm-network-bridge-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetworkBridge}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/bridges/[toCaip2=eip155NetworkCaip2]/[url]', {
			caip2: `${String(({ ...selection.entitySelector, ...prefetched }).$fromNetwork.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$fromNetwork.caip2.reference)}`,
			toCaip2: `${String(({ ...selection.entitySelector, ...prefetched }).$toNetwork.caip2.namespace)}:${String(({ ...selection.entitySelector, ...prefetched }).$toNetwork.caip2.reference)}`,
			url: String(({ ...selection.entitySelector, ...prefetched }).url),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const url0 = ({ ...selection.entitySelector, ...prefetched }).url}
			{#if url0 !== undefined && url0 !== null}
				<svelte:element
					this={'a'}
					href={String(url0)}
					target="_blank"
					rel="noreferrer noopener"
				>
					<TruncatedValue value={String(url0)} />
				</svelte:element>
			{/if}
		{:else}
			<ResourceBoundary resource={evmNetworkBridge}>
				{#snippet Pending()}
					{@const url0 = ({ ...selection.entitySelector, ...prefetched }).url}
					{#if url0 !== undefined && url0 !== null}
						<svelte:element
							this={'a'}
							href={String(url0)}
							target="_blank"
							rel="noreferrer noopener"
						>
							<TruncatedValue value={String(url0)} />
						</svelte:element>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const url0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).url}
					{#if url0 !== undefined && url0 !== null}
						<svelte:element
							this={'a'}
							href={String(url0)}
							target="_blank"
							rel="noreferrer noopener"
						>
							<TruncatedValue value={String(url0)} />
						</svelte:element>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const url0 = ({ ...selection.entitySelector, ...prefetched }).url}
			{#if url0 !== undefined && url0 !== null}
				<TruncatedValue value={String(url0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={evmNetworkBridge}>
				{#snippet Pending()}
					{@const url0 = ({ ...selection.entitySelector, ...prefetched }).url}
					{#if url0 !== undefined && url0 !== null}
						<TruncatedValue value={String(url0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const url0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).url}
					{#if url0 !== undefined && url0 !== null}
						<TruncatedValue value={String(url0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const relationshipType0 = prefetched.relationshipType}
			{#if relationshipType0 !== undefined && relationshipType0 !== null}
				<span data-text="muted">
					{String((relationshipType0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={evmNetworkBridge}>
				{#snippet Pending()}
					{@const relationshipType0 = prefetched.relationshipType}
					{#if relationshipType0 !== undefined && relationshipType0 !== null}
						<span data-text="muted">
							{String((relationshipType0) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const relationshipType0 = entity.relationshipType}
					{#if relationshipType0 !== undefined && relationshipType0 !== null}
						<span data-text="muted">
							{String((relationshipType0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>From network</dt>
				<dd>
					<EvmNetworkView
						selection={select(EntityType.EvmNetwork, selection.entitySelector.$fromNetwork)}
						href={
							(selection.entitySelector.$fromNetwork?.caip2 != null && selection.entitySelector.$fromNetwork?.caip2?.namespace != null && selection.entitySelector.$fromNetwork?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
								caip2: `${String(selection.entitySelector.$fromNetwork.caip2.namespace)}:${String(selection.entitySelector.$fromNetwork.caip2.reference)}`,
							}) : selection.entitySelector.$fromNetwork?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
								networkSlug: String(selection.entitySelector.$fromNetwork.slug),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>To network</dt>
				<dd>
					<EvmNetworkView
						selection={select(EntityType.EvmNetwork, selection.entitySelector.$toNetwork)}
						href={
							(selection.entitySelector.$toNetwork?.caip2 != null && selection.entitySelector.$toNetwork?.caip2?.namespace != null && selection.entitySelector.$toNetwork?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
								caip2: `${String(selection.entitySelector.$toNetwork.caip2.namespace)}:${String(selection.entitySelector.$toNetwork.caip2.reference)}`,
							}) : selection.entitySelector.$toNetwork?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
								networkSlug: String(selection.entitySelector.$toNetwork.slug),
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
