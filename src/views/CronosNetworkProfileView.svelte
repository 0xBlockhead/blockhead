<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
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
			selection: RegisteredEntityProxyResource<EntityType.CronosNetworkProfile>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.CronosNetworkProfile>
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
	const cronosNetworkProfile = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			chainKind: true,
			consensusKind: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			chainKind: true,
			consensusKind: true,
		},
	}))
	const titleFallback = 'cronos network profile'
	const viewDomId = $derived('cronos-network-profile-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import IbcChannelsView from '$/views/IbcChannelsView.svelte'
	import Network_TimestampsView from '$/views/Network_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
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
			{#snippet children(entity)}
				<NetworkView
					selection={select(EntityType.Network, selection.entitySelector.$network)}
					href=""
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cronosNetworkProfile}>
			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.chainKind) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cronosNetworkProfile}>
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
							(
								selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
								&& selection.entitySelector.$network.caip2 != null ?
									resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							})
							:
									selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
									&& selection.entitySelector.$network.slug != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(selection.entitySelector.$network.slug ?? ''),
								})
								:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$evmNetwork}
			>
				{#snippet children(network)}
					{#if network != null && network[EntityMetaKey.Selector] != null}
						<div>
							<dt>EVM network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									href={
										(
											network[EntityMetaKey.Selector] != null && 'caip2' in network[EntityMetaKey.Selector]
											&& network[EntityMetaKey.Selector].caip2 != null ?
												resolve('/network/[network=networkCaip2OrNetworkSlug]', {
											network: String(caip2StringFromValue(network[EntityMetaKey.Selector].caip2) ?? ''),
										})
										:
												network[EntityMetaKey.Selector] != null && 'slug' in network[EntityMetaKey.Selector]
												&& network[EntityMetaKey.Selector].slug != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]', {
												network: String(network[EntityMetaKey.Selector].slug ?? ''),
											})
											:
												undefined
										)
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
				resource={selection.$cosmosNetwork}
			>
				{#snippet children(network)}
					{#if network != null && network[EntityMetaKey.Selector] != null}
						<div>
							<dt>Cosmos network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									href={
										(
											network[EntityMetaKey.Selector] != null && 'caip2' in network[EntityMetaKey.Selector]
											&& network[EntityMetaKey.Selector].caip2 != null ?
												resolve('/network/[network=networkCaip2OrNetworkSlug]', {
											network: String(caip2StringFromValue(network[EntityMetaKey.Selector].caip2) ?? ''),
										})
										:
												network[EntityMetaKey.Selector] != null && 'slug' in network[EntityMetaKey.Selector]
												&& network[EntityMetaKey.Selector].slug != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]', {
												network: String(network[EntityMetaKey.Selector].slug ?? ''),
											})
											:
												undefined
										)
									}
									layout={EntityLayout.Value}
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
								sources: selection.sources,
								fields: {
									chainKind: true,
								},
							})
						}
					>
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
						sources: selection.sources,
						fields: {
							consensusKind: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							bech32Prefix: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							evmChainId: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							cosmosChainId: true,
						},
					})
				}
			>
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
		{@const cronosNetworkProfileIbcChannelsViewIbcChannelsResource = selection.$$ibcChannels}
		<ResourceBoundary
			resource={cronosNetworkProfileIbcChannelsViewIbcChannelsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<IbcChannelsView
					selection={cronosNetworkProfileIbcChannelsViewIbcChannelsResource}
					countResource={cronosNetworkProfileIbcChannelsViewIbcChannelsResource.count}
					title='ibc channels'
					id='IbcChannelsView-ibc-channels'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const cronosNetworkProfileNetworkTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={cronosNetworkProfileNetworkTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<Network_TimestampsView
					selection={cronosNetworkProfileNetworkTimestampsViewTimestampsResource}
					countResource={cronosNetworkProfileNetworkTimestampsViewTimestampsResource.count}
					title='timestamps'
					id='Network_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
