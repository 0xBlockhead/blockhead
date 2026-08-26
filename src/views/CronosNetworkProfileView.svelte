<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.CronosNetworkProfile>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const cronosNetworkProfile = $derived(selection({
		fields: {
			chainKind: true,
			consensusKind: true,
		},
	}))
	const titleFallback = 'cronos network profile'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import IbcChannelsView from '$/views/IbcChannelsView.svelte'
	import Network_TimestampsView from '$/views/Network_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.CronosNetworkProfile}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/cronos',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cronosNetworkProfile}>
			{#snippet children(entity)}
				{entity.chainKind || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={cronosNetworkProfile}>
			{#snippet children(entity)}
				{@const consensusKind = entity.consensusKind}
				{#if consensusKind != null}
					<span data-text="muted">
						{consensusKind}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$evmNetwork}
			>
				{#snippet children(network)}
					{#if network != null}
						{@const networkInitial = untrack(() => network)}
						<div>
							<dt>EVM network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, (network ?? networkInitial)[EntityMetaKey.Selector])}
									prefetched={network ?? networkInitial}
									layout={EntityLayout.Value}
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
					{#if network != null}
						{@const networkInitial = untrack(() => network)}
						<div>
							<dt>Cosmos network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, (network ?? networkInitial)[EntityMetaKey.Selector])}
									prefetched={network ?? networkInitial}
									layout={EntityLayout.Value}
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
						resource={cronosNetworkProfile}
					>
						{#snippet children(entity)}
							{entity.chainKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={cronosNetworkProfile}
			>
				{#snippet children(entity)}
					{@const consensusKind = entity.consensusKind}
					{#if consensusKind != null}
						<div>
							<dt>consensus kind</dt>
							<dd>
								{consensusKind}
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
				{#snippet children(entity)}
					{@const bech32Prefix = entity.bech32Prefix}
					{#if bech32Prefix != null}
						<div>
							<dt>bech32 prefix</dt>
							<dd>
								{bech32Prefix}
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
				{#snippet children(entity)}
					{@const evmChainId = entity.evmChainId}
					{#if evmChainId != null}
						<div>
							<dt>EVM chain ID</dt>
							<dd>
								{evmChainId}
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
				{#snippet children(entity)}
					{@const cosmosChainId = entity.cosmosChainId}
					{#if cosmosChainId != null}
						<div>
							<dt>Cosmos chain ID</dt>
							<dd>
								{cosmosChainId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const ibcChannelsResource = selection.$$ibcChannels}
		<ResourceBoundary
			resource={ibcChannelsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<IbcChannelsView
						selection={ibcChannelsResource}
						countResource={ibcChannelsResource.count}
						title='ibc channels'
						id='ibc-channels'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<Network_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
