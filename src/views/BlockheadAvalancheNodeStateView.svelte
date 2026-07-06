<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadAvalancheNodeState>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadAvalancheNodeState>>
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
	const blockheadAvalancheNodeState = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			$network: true,
			nodeIp: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.nodeId ?? prefetched.nodeId) ?? '')].filter(Boolean).join(' ') || 'blockhead avalanche node state')
	const viewDomId = $derived('blockhead-avalanche-node-state-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BlockheadAvalancheNodeState_TimestampsView from '$/views/BlockheadAvalancheNodeState_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadAvalancheNodeState}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadAvalancheNodeState}>
			{#snippet Pending()}
				{[String((selection.entitySelector.nodeId ?? prefetched.nodeId) ?? '')].filter(Boolean).join(' ') || title || 'blockhead avalanche node state'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.nodeId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadAvalancheNodeState}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.Network, false>('$network')}
				>
					{#snippet children(network)}
						{#if network != null && network[EntityMetaKey.Selector] != null}
							<NetworkView
								selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
								prefetched={network}
								href={
									(network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.namespace !== undefined && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
										caip2: `${String(network[EntityMetaKey.Selector].caip2.namespace ?? '')}:${String(network[EntityMetaKey.Selector].caip2.reference ?? '')}`,
									}) : network[EntityMetaKey.Selector].slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
										networkSlug: String(network[EntityMetaKey.Selector].slug ?? ''),
									}) : undefined)
								}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.Network, false>('$network')}
				>
					{#snippet children(network)}
						{#if network != null && network[EntityMetaKey.Selector] != null}
							<NetworkView
								selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
								prefetched={network}
								href={
									(network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.namespace !== undefined && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
										caip2: `${String(network[EntityMetaKey.Selector].caip2.namespace ?? '')}:${String(network[EntityMetaKey.Selector].caip2.reference ?? '')}`,
									}) : network[EntityMetaKey.Selector].slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
										networkSlug: String(network[EntityMetaKey.Selector].slug ?? ''),
									}) : undefined)
								}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadAvalancheNodeState}>
			{#snippet Pending()}
				{@const nodeIp0 = prefetched.nodeIp}
				{#if nodeIp0 !== undefined && nodeIp0 !== null}
					<span data-text="muted">
						{String((nodeIp0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const nodeIp0 = resolvedEntity.nodeIp}
				{#if nodeIp0 !== undefined && nodeIp0 !== null}
					<span data-text="muted">
						{String((nodeIp0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>node ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									nodeId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const nodeId = selection.entitySelector.nodeId ?? prefetched.nodeId}
							{#if nodeId !== undefined && nodeId !== null}
								{String((nodeId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const nodeId = resolvedEntity.nodeId}
							{#if nodeId !== undefined && nodeId !== null}
								{String((nodeId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.Network, false>('$network')}
			>
				{#snippet children(network)}
					{#if network != null && network[EntityMetaKey.Selector] != null}
						<div>
							<dt>network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									href={
										(network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.namespace !== undefined && network[EntityMetaKey.Selector].caip2 !== undefined && network[EntityMetaKey.Selector].caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
											caip2: `${String(network[EntityMetaKey.Selector].caip2.namespace ?? '')}:${String(network[EntityMetaKey.Selector].caip2.reference ?? '')}`,
										}) : network[EntityMetaKey.Selector].slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
											networkSlug: String(network[EntityMetaKey.Selector].slug ?? ''),
										}) : undefined)
									}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nodeIp: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nodeIp = prefetched.nodeIp}
					{#if nodeIp !== undefined && nodeIp !== null}
						<div>
							<dt>node IP</dt>
							<dd>
								{String((nodeIp) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nodeIp = resolvedEntity.nodeIp}
					{#if nodeIp !== undefined && nodeIp !== null}
						<div>
							<dt>node IP</dt>
							<dd>
								{String((nodeIp) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nodePopPublicKey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nodePopPublicKey = prefetched.nodePopPublicKey}
					{#if nodePopPublicKey !== undefined && nodePopPublicKey !== null}
						<div>
							<dt>node PoP public key</dt>
							<dd>
								{String((nodePopPublicKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nodePopPublicKey = resolvedEntity.nodePopPublicKey}
					{#if nodePopPublicKey !== undefined && nodePopPublicKey !== null}
						<div>
							<dt>node PoP public key</dt>
							<dd>
								{String((nodePopPublicKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nodePopProofOfPossession: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nodePopProofOfPossession = prefetched.nodePopProofOfPossession}
					{#if nodePopProofOfPossession !== undefined && nodePopProofOfPossession !== null}
						<div>
							<dt>node PoP proof of possession</dt>
							<dd>
								{String((nodePopProofOfPossession) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nodePopProofOfPossession = resolvedEntity.nodePopProofOfPossession}
					{#if nodePopProofOfPossession !== undefined && nodePopProofOfPossession !== null}
						<div>
							<dt>node PoP proof of possession</dt>
							<dd>
								{String((nodePopProofOfPossession) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadAvalancheNodeState_TimestampsView
				selection={selection[EntityProxyField]<EntityType.BlockheadAvalancheNodeState_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No Avalanche node-state observations.'
				id='BlockheadAvalancheNodeState_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
