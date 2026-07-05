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
			selection: EntityProxyResource<typeof schema, EntityType.CronosNetworkProfile>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.CronosNetworkProfile>>
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
	const cronosNetworkProfile = $derived(selection({
		fields: {
			chainKind: true,
			consensusKind: true,
		},
	}))
	const titleFallback = $derived('cronos network profile')
	const viewDomId = $derived('cronos-network-profile-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import IbcChannelsView from '$/views/IbcChannelsView.svelte'
	import Network_TimestampsView from '$/views/Network_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
	import CosmosNetworkView from '$/views/CosmosNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CronosNetworkProfile}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={cronosNetworkProfile}>
			{#snippet Pending()}
				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
							caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
						}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
							networkSlug: String(selection.entitySelector.$network.slug ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
							caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
						}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
							networkSlug: String(selection.entitySelector.$network.slug ?? ''),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cronosNetworkProfile}>
			{#snippet Pending()}
				{[String((prefetched.chainKind) ?? '')].filter(Boolean).join(' ') || title || 'cronos network profile'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.chainKind) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cronosNetworkProfile}>
			{#snippet Pending()}
				{@const consensusKind0 = prefetched.consensusKind}
				{#if consensusKind0 !== undefined && consensusKind0 !== null}
					<span data-text="muted">
						{String((consensusKind0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const consensusKind0 = resolvedEntity.consensusKind}
				{#if consensusKind0 !== undefined && consensusKind0 !== null}
					<span data-text="muted">
						{String((consensusKind0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmNetwork, false>('$evmNetwork')}
			>
				{#snippet children(evmNetwork)}
					{#if evmNetwork != null && evmNetwork[EntityMetaKey.Selector] != null}
						<div>
							<dt>EVM network</dt>
							<dd>
								<EvmNetworkView
									selection={select(EntityType.EvmNetwork, evmNetwork[EntityMetaKey.Selector])}
									prefetched={evmNetwork}
									href={
										(({ ...evmNetwork[EntityMetaKey.Selector], ...evmNetwork }).caip2 !== undefined && ({ ...evmNetwork[EntityMetaKey.Selector], ...evmNetwork }).caip2.namespace !== undefined && ({ ...evmNetwork[EntityMetaKey.Selector], ...evmNetwork }).caip2 !== undefined && ({ ...evmNetwork[EntityMetaKey.Selector], ...evmNetwork }).caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
											caip2: `${String(({ ...evmNetwork[EntityMetaKey.Selector], ...evmNetwork }).caip2.namespace ?? '')}:${String(({ ...evmNetwork[EntityMetaKey.Selector], ...evmNetwork }).caip2.reference ?? '')}`,
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.CosmosNetwork, false>('$cosmosNetwork')}
			>
				{#snippet children(cosmosNetwork)}
					{#if cosmosNetwork != null && cosmosNetwork[EntityMetaKey.Selector] != null}
						<div>
							<dt>Cosmos network</dt>
							<dd>
								<CosmosNetworkView
									selection={select(EntityType.CosmosNetwork, cosmosNetwork[EntityMetaKey.Selector])}
									prefetched={cosmosNetwork}
									href={
										(({ ...cosmosNetwork[EntityMetaKey.Selector], ...cosmosNetwork }).$network !== undefined && ({ ...cosmosNetwork[EntityMetaKey.Selector], ...cosmosNetwork }).$network.caip2 !== undefined && ({ ...cosmosNetwork[EntityMetaKey.Selector], ...cosmosNetwork }).$network.caip2.namespace !== undefined && ({ ...cosmosNetwork[EntityMetaKey.Selector], ...cosmosNetwork }).$network !== undefined && ({ ...cosmosNetwork[EntityMetaKey.Selector], ...cosmosNetwork }).$network.caip2 !== undefined && ({ ...cosmosNetwork[EntityMetaKey.Selector], ...cosmosNetwork }).$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
											caip2: `${String(({ ...cosmosNetwork[EntityMetaKey.Selector], ...cosmosNetwork }).$network.caip2.namespace ?? '')}:${String(({ ...cosmosNetwork[EntityMetaKey.Selector], ...cosmosNetwork }).$network.caip2.reference ?? '')}`,
										}) : undefined)
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>chain kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									chainKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const chainKind = prefetched.chainKind}
							{#if chainKind !== undefined && chainKind !== null}
								{String((chainKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const chainKind = resolvedEntity.chainKind}
							{#if chainKind !== undefined && chainKind !== null}
								{String((chainKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							consensusKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const consensusKind = prefetched.consensusKind}
					{#if consensusKind !== undefined && consensusKind !== null}
						<div>
							<dt>consensus kind</dt>
							<dd>
								{String((consensusKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const consensusKind = resolvedEntity.consensusKind}
					{#if consensusKind !== undefined && consensusKind !== null}
						<div>
							<dt>consensus kind</dt>
							<dd>
								{String((consensusKind) ?? '')}
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
							bech32Prefix: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const bech32Prefix = prefetched.bech32Prefix}
					{#if bech32Prefix !== undefined && bech32Prefix !== null}
						<div>
							<dt>bech32 prefix</dt>
							<dd>
								{String((bech32Prefix) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const bech32Prefix = resolvedEntity.bech32Prefix}
					{#if bech32Prefix !== undefined && bech32Prefix !== null}
						<div>
							<dt>bech32 prefix</dt>
							<dd>
								{String((bech32Prefix) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							evmChainId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const evmChainId = prefetched.evmChainId}
					{#if evmChainId !== undefined && evmChainId !== null}
						<div>
							<dt>EVM chain ID</dt>
							<dd>
								{String((evmChainId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const evmChainId = resolvedEntity.evmChainId}
					{#if evmChainId !== undefined && evmChainId !== null}
						<div>
							<dt>EVM chain ID</dt>
							<dd>
								{String((evmChainId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							cosmosChainId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const cosmosChainId = prefetched.cosmosChainId}
					{#if cosmosChainId !== undefined && cosmosChainId !== null}
						<div>
							<dt>Cosmos chain ID</dt>
							<dd>
								{String((cosmosChainId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const cosmosChainId = resolvedEntity.cosmosChainId}
					{#if cosmosChainId !== undefined && cosmosChainId !== null}
						<div>
							<dt>Cosmos chain ID</dt>
							<dd>
								{String((cosmosChainId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<IbcChannelsView
				selection={selection[EntityProxyField]<EntityType.IbcChannel>('$$ibcChannels')}
				title='ibc channels'
				emptyText='No IBC channels.'
				id='IbcChannelsView-$$ibcChannels'
			/>

			<Network_TimestampsView
				selection={selection[EntityProxyField]<EntityType.Network_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No network observations.'
				id='Network_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
