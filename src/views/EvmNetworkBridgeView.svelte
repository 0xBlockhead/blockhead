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
			selection: RegisteredEntityProxyResource<EntityType.EvmNetworkBridge>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.EvmNetworkBridge>>
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
	const evmNetworkBridge = $derived(selection({
		sources: selection.sources,
		fields: {
			relationshipType: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.url) ?? '')].filter(Boolean).join(' ') || 'EVM network bridge')
	const viewDomId = $derived('evm-network-bridge-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetworkBridge}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$toNetwork !== undefined && pendingEntity.$toNetwork.caip2 !== undefined && pendingEntity.url !== undefined && pendingEntity.$fromNetwork !== undefined && pendingEntity.$fromNetwork.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/bridges/[toCaip2=networkCaip2]/[url=absoluteUrl]', {
			toCaip2: String(caip2StringFromValue(pendingEntity.$toNetwork.caip2) ?? ''),
			url: encodeURIComponent(String(pendingEntity.url ?? '')),
			network: String(caip2StringFromValue(pendingEntity.$fromNetwork.caip2) ?? ''),
		}) : pendingEntity.$toNetwork !== undefined && pendingEntity.$toNetwork.caip2 !== undefined && pendingEntity.url !== undefined && pendingEntity.$fromNetwork !== undefined && pendingEntity.$fromNetwork.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/bridges/[toCaip2=networkCaip2]/[url=absoluteUrl]', {
			toCaip2: String(caip2StringFromValue(pendingEntity.$toNetwork.caip2) ?? ''),
			url: encodeURIComponent(String(pendingEntity.url ?? '')),
			network: String(pendingEntity.$fromNetwork.slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const url0 = pendingEntity.url}
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
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const url0 = resolvedEntity.url}
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
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const url0 = pendingEntity.url}
					{#if url0 !== undefined && url0 !== null}
						<TruncatedValue value={String((url0) ?? '')} />
					{/if}
		{:else}
			<ResourceBoundary resource={evmNetworkBridge}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const url0 = resolvedEntity.url}
					{#if url0 !== undefined && url0 !== null}
						<TruncatedValue value={String((url0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const relationshipType0 = pendingEntity.relationshipType}
			{#if relationshipType0 !== undefined && relationshipType0 !== null}
				<span data-text="muted">
					{String((relationshipType0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={evmNetworkBridge}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const relationshipType0 = resolvedEntity.relationshipType}
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
				<dt>URL</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									url: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const url = resolvedEntity.url}
							{#if url !== undefined && url !== null}
								<svelte:element
									this={'a'}
									href={String(url)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(url)} />
								</svelte:element>
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
							relationshipType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const relationshipType = resolvedEntity.relationshipType}
					{#if relationshipType !== undefined && relationshipType !== null}
						<div>
							<dt>Relationship type</dt>
							<dd>
								{String((relationshipType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>From network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$fromNetwork, {})}
						href={
							(selection.entitySelector.$fromNetwork.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$fromNetwork.caip2) ?? ''),
							}) : selection.entitySelector.$fromNetwork.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$fromNetwork.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>To network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$toNetwork, {})}
						href={
							(selection.entitySelector.$toNetwork.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$toNetwork.caip2) ?? ''),
							}) : selection.entitySelector.$toNetwork.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$toNetwork.slug ?? ''),
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
