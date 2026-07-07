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
			selection: EntityProxyResource<typeof schema, EntityType.IbcDenomTrace>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.IbcDenomTrace>>
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
		fields: {
			displayDenom: true,
			baseDenom: true,
			denomHash: true,
			sourceChannel: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.displayDenom) ?? ''), String((prefetched.baseDenom) ?? ''), String((selection.entitySelector.traceKey ?? prefetched.traceKey) ?? '')].filter(Boolean).join(' ') || 'IBC denom trace')
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
		<ResourceBoundary resource={ibcDenomTrace}>
			{#snippet Pending()}
				{[String((prefetched.displayDenom) ?? ''), String((prefetched.baseDenom) ?? ''), String((selection.entitySelector.traceKey ?? prefetched.traceKey) ?? '')].filter(Boolean).join(' ') || title || 'IBC denom trace'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.displayDenom) ?? ''), String((resolvedEntity.baseDenom) ?? ''), String((resolvedEntity.traceKey) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={ibcDenomTrace}>
			{#snippet Pending()}
				{[String((prefetched.denomHash) ?? ''), String((selection.entitySelector.traceKey ?? prefetched.traceKey) ?? '')].filter(Boolean).join(' ') || [String((prefetched.displayDenom) ?? ''), String((prefetched.baseDenom) ?? ''), String((selection.entitySelector.traceKey ?? prefetched.traceKey) ?? '')].filter(Boolean).join(' ') || title || 'IBC denom trace'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.denomHash) ?? ''), String((resolvedEntity.traceKey) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.displayDenom) ?? ''), String((resolvedEntity.baseDenom) ?? ''), String((resolvedEntity.traceKey) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={ibcDenomTrace}>
			{#snippet Pending()}
				{@const sourceChannel0 = prefetched.sourceChannel}
				{#if sourceChannel0 !== undefined && sourceChannel0 !== null}
					<span data-text="muted">
						{String((sourceChannel0) ?? '')}
					</span>
				{/if}
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Trace key</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									traceKey: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const traceKey = selection.entitySelector.traceKey ?? prefetched.traceKey}
							{#if traceKey !== undefined && traceKey !== null}
								<TruncatedValue value={String((traceKey) ?? '')} />
							{/if}
						{/snippet}

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
						fields: {
							denomHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const denomHash = prefetched.denomHash}
					{#if denomHash !== undefined && denomHash !== null}
						<div>
							<dt>Denom hash</dt>
							<dd>
								<TruncatedValue value={String((denomHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							path: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const path = prefetched.path}
					{#if path !== undefined && path !== null}
						<div>
							<dt>Path</dt>
							<dd>
								{String((path) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							baseDenom: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const baseDenom = prefetched.baseDenom}
					{#if baseDenom !== undefined && baseDenom !== null}
						<div>
							<dt>Base denom</dt>
							<dd>
								{String((baseDenom) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							displayDenom: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const displayDenom = prefetched.displayDenom}
					{#if displayDenom !== undefined && displayDenom !== null}
						<div>
							<dt>Display denom</dt>
							<dd>
								{String((displayDenom) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							sourcePort: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourcePort = prefetched.sourcePort}
					{#if sourcePort !== undefined && sourcePort !== null}
						<div>
							<dt>Source port</dt>
							<dd>
								{String((sourcePort) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							sourceChannel: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceChannel = prefetched.sourceChannel}
					{#if sourceChannel !== undefined && sourceChannel !== null}
						<div>
							<dt>Source channel</dt>
							<dd>
								{String((sourceChannel) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
							(selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('Evm') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('CosmosSdk') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('Evm') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$network.caip2.namespace) + ':' + String(selection.entitySelector.$network.caip2.reference))].slug ?? ''),
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('SolanaRuntime') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('PolkadotRuntime') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.ledgerModels !== undefined && selection.entitySelector.$network.ledgerModels.values.includes('Utxo') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
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
