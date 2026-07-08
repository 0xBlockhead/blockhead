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
	import { networkByCaip2 } from '$/constants/Network.ts'
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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const evmNetworkBridge = $derived(selection({
		fields: {
			relationshipType: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.url ?? prefetched.url) ?? '')].filter(Boolean).join(' ') || 'EVM network bridge')
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
		href ?? (pendingEntity.$fromNetwork !== undefined && pendingEntity.$fromNetwork.caip2 !== undefined && pendingEntity.$fromNetwork.caip2.namespace !== undefined && pendingEntity.$fromNetwork !== undefined && pendingEntity.$fromNetwork.caip2 !== undefined && pendingEntity.$fromNetwork.caip2.reference !== undefined && pendingEntity.$toNetwork !== undefined && pendingEntity.$toNetwork.caip2 !== undefined && pendingEntity.$toNetwork.caip2.namespace !== undefined && pendingEntity.$toNetwork !== undefined && pendingEntity.$toNetwork.caip2 !== undefined && pendingEntity.$toNetwork.caip2.reference !== undefined && pendingEntity.url !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/bridges/[toCaip2=eip155NetworkCaip2]/[url]', {
			caip2: `${String(pendingEntity.$fromNetwork.caip2.namespace ?? '')}:${String(pendingEntity.$fromNetwork.caip2.reference ?? '')}`,
			toCaip2: `${String(pendingEntity.$toNetwork.caip2.namespace ?? '')}:${String(pendingEntity.$toNetwork.caip2.reference ?? '')}`,
			url: String(pendingEntity.url ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmNetworkBridge}>
			{#snippet Pending()}
				{@const url0 = selection.entitySelector.url ?? prefetched.url}
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
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmNetworkBridge}>
			{#snippet Pending()}
				{@const url0 = selection.entitySelector.url ?? prefetched.url}
				{#if url0 !== undefined && url0 !== null}
					<TruncatedValue value={String((url0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const url0 = resolvedEntity.url}
				{#if url0 !== undefined && url0 !== null}
					<TruncatedValue value={String((url0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
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
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const relationshipType0 = resolvedEntity.relationshipType}
				{#if relationshipType0 !== undefined && relationshipType0 !== null}
					<span data-text="muted">
						{String((relationshipType0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>URL</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									url: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const url = selection.entitySelector.url ?? prefetched.url}
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
						fields: {
							relationshipType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const relationshipType = prefetched.relationshipType}
					{#if relationshipType !== undefined && relationshipType !== null}
						<div>
							<dt>Relationship type</dt>
							<dd>
								{String((relationshipType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
							(selection.entitySelector.$fromNetwork.executionModels !== undefined && selection.entitySelector.$fromNetwork.executionModels.values.includes('Evm') && selection.entitySelector.$fromNetwork.caip2 !== undefined && selection.entitySelector.$fromNetwork.caip2.namespace !== undefined && selection.entitySelector.$fromNetwork.caip2 !== undefined && selection.entitySelector.$fromNetwork.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
								caip2: `${String(selection.entitySelector.$fromNetwork.caip2.namespace ?? '')}:${String(selection.entitySelector.$fromNetwork.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$fromNetwork.executionModels !== undefined && selection.entitySelector.$fromNetwork.executionModels.values.includes('CosmosSdk') && selection.entitySelector.$fromNetwork.caip2 !== undefined && selection.entitySelector.$fromNetwork.caip2.namespace !== undefined && selection.entitySelector.$fromNetwork.caip2 !== undefined && selection.entitySelector.$fromNetwork.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
								caip2: `${String(selection.entitySelector.$fromNetwork.caip2.namespace ?? '')}:${String(selection.entitySelector.$fromNetwork.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$fromNetwork.executionModels !== undefined && selection.entitySelector.$fromNetwork.executionModels.values.includes('Evm') && selection.entitySelector.$fromNetwork.caip2 !== undefined && selection.entitySelector.$fromNetwork.caip2.namespace !== undefined && selection.entitySelector.$fromNetwork.caip2 !== undefined && selection.entitySelector.$fromNetwork.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$fromNetwork.caip2.namespace) + ':' + String(selection.entitySelector.$fromNetwork.caip2.reference))].slug ?? ''),
							}) : selection.entitySelector.$fromNetwork.executionModels !== undefined && selection.entitySelector.$fromNetwork.executionModels.values.includes('SolanaRuntime') && selection.entitySelector.$fromNetwork.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana', {
								networkSlug: String(selection.entitySelector.$fromNetwork.slug ?? ''),
							}) : selection.entitySelector.$fromNetwork.executionModels !== undefined && selection.entitySelector.$fromNetwork.executionModels.values.includes('PolkadotRuntime') && selection.entitySelector.$fromNetwork.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot', {
								networkSlug: String(selection.entitySelector.$fromNetwork.slug ?? ''),
							}) : selection.entitySelector.$fromNetwork.ledgerModels !== undefined && selection.entitySelector.$fromNetwork.ledgerModels.values.includes('Utxo') && selection.entitySelector.$fromNetwork.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo', {
								networkSlug: String(selection.entitySelector.$fromNetwork.slug ?? ''),
							}) : selection.entitySelector.$fromNetwork.caip2 !== undefined && selection.entitySelector.$fromNetwork.caip2.namespace !== undefined && selection.entitySelector.$fromNetwork.caip2 !== undefined && selection.entitySelector.$fromNetwork.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$fromNetwork.caip2.namespace ?? '')}:${String(selection.entitySelector.$fromNetwork.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$fromNetwork.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$fromNetwork.slug ?? ''),
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
							(selection.entitySelector.$toNetwork.executionModels !== undefined && selection.entitySelector.$toNetwork.executionModels.values.includes('Evm') && selection.entitySelector.$toNetwork.caip2 !== undefined && selection.entitySelector.$toNetwork.caip2.namespace !== undefined && selection.entitySelector.$toNetwork.caip2 !== undefined && selection.entitySelector.$toNetwork.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
								caip2: `${String(selection.entitySelector.$toNetwork.caip2.namespace ?? '')}:${String(selection.entitySelector.$toNetwork.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$toNetwork.executionModels !== undefined && selection.entitySelector.$toNetwork.executionModels.values.includes('CosmosSdk') && selection.entitySelector.$toNetwork.caip2 !== undefined && selection.entitySelector.$toNetwork.caip2.namespace !== undefined && selection.entitySelector.$toNetwork.caip2 !== undefined && selection.entitySelector.$toNetwork.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
								caip2: `${String(selection.entitySelector.$toNetwork.caip2.namespace ?? '')}:${String(selection.entitySelector.$toNetwork.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$toNetwork.executionModels !== undefined && selection.entitySelector.$toNetwork.executionModels.values.includes('Evm') && selection.entitySelector.$toNetwork.caip2 !== undefined && selection.entitySelector.$toNetwork.caip2.namespace !== undefined && selection.entitySelector.$toNetwork.caip2 !== undefined && selection.entitySelector.$toNetwork.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$toNetwork.caip2.namespace) + ':' + String(selection.entitySelector.$toNetwork.caip2.reference))].slug ?? ''),
							}) : selection.entitySelector.$toNetwork.executionModels !== undefined && selection.entitySelector.$toNetwork.executionModels.values.includes('SolanaRuntime') && selection.entitySelector.$toNetwork.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana', {
								networkSlug: String(selection.entitySelector.$toNetwork.slug ?? ''),
							}) : selection.entitySelector.$toNetwork.executionModels !== undefined && selection.entitySelector.$toNetwork.executionModels.values.includes('PolkadotRuntime') && selection.entitySelector.$toNetwork.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot', {
								networkSlug: String(selection.entitySelector.$toNetwork.slug ?? ''),
							}) : selection.entitySelector.$toNetwork.ledgerModels !== undefined && selection.entitySelector.$toNetwork.ledgerModels.values.includes('Utxo') && selection.entitySelector.$toNetwork.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo', {
								networkSlug: String(selection.entitySelector.$toNetwork.slug ?? ''),
							}) : selection.entitySelector.$toNetwork.caip2 !== undefined && selection.entitySelector.$toNetwork.caip2.namespace !== undefined && selection.entitySelector.$toNetwork.caip2 !== undefined && selection.entitySelector.$toNetwork.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$toNetwork.caip2.namespace ?? '')}:${String(selection.entitySelector.$toNetwork.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$toNetwork.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$toNetwork.slug ?? ''),
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
