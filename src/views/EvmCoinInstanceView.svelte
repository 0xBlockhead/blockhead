<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
	import { UrlString } from '$/schema/UrlString.ts'
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
			selection: EntityProxyResource<typeof schema, EntityType.EvmCoinInstance>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.EvmCoinInstance>>
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

	const evmCoinInstance = $derived(selection({
		sources: open ? [
			Source.Constants_Internal,
			Source.Chainlist_Rest,
			Source.EthereumLists_Rest,
			Source.Coingecko_Rest,
			Source.Lifi_Rest,
		] : [
			Source.Constants_Internal,
			Source.Chainlist_Rest,
			Source.EthereumLists_Rest,
		],
		fields: {
			$icon: true,
			symbol: true,
			name: true,
			...(open && {
				coinId: true,
				decimals: true,
				caip19: true,
				representation: true,
				iconUrl: true,
				$contract: true,
				$canonicalInstance: true,
				$$outboundBridgeCapabilities: true,
				$$inboundBridgeCapabilities: true,
				$$marketsWithInstanceAsBase: true,
				$$marketsWithInstanceAsQuote: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).symbol) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || 'EVM coin instance')
	const viewDomId = $derived('evm-coin-instance-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CoinBridgeCapabilitiesView from '$/views/CoinBridgeCapabilitiesView.svelte'
	import MarketsView from '$/views/MarketsView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmCoinInstance}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug]', {
			chainId: String(({ ...selection.entitySelector, ...prefetched }).$network.caip2.reference),
			coinInstanceSlug: String(
				(
					({ ...selection.entitySelector, ...prefetched }).type === 'NativeCurrency' ?
						'native'
					:
						({ ...selection.entitySelector, ...prefetched }).$contract.address
				)
			),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={evmCoinInstance}>
			{#snippet Pending()}
				<IconComponent />
			{/snippet}

			{#snippet children(entity)}
				{@const reference = entity.$icon}
				{#if reference?.[EntityMetaKey.Selector] !== undefined}
					<MediaView
						selection={select(EntityType.Media, reference[EntityMetaKey.Selector])}
						prefetched={reference}
						layout={EntityLayout.Value}
						open={false}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).symbol) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || 'EVM coin instance'}
		{:else}
			<ResourceBoundary resource={evmCoinInstance}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).symbol) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || 'EVM coin instance'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.symbol) ?? ''), String((entity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{[String((({ ...selection.entitySelector, ...prefetched }).symbol) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).symbol) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || 'EVM coin instance'}
		{:else}
			<ResourceBoundary resource={evmCoinInstance}>
				{#snippet Pending()}
					{[String((({ ...selection.entitySelector, ...prefetched }).symbol) ?? '')].filter(Boolean).join(' ') || [String((({ ...selection.entitySelector, ...prefetched }).symbol) ?? ''), String((({ ...selection.entitySelector, ...prefetched }).name) ?? '')].filter(Boolean).join(' ') || title || 'EVM coin instance'}
				{/snippet}

				{#snippet children(entity)}
					{[String((entity.symbol) ?? '')].filter(Boolean).join(' ') || [String((entity.symbol) ?? ''), String((entity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			<span data-text="muted">
				<EvmNetworkView
					selection={select(EntityType.EvmNetwork, selection.entitySelector.$network)}
					href={
						(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
							caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
						}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
							networkSlug: String(selection.entitySelector.$network.slug),
						}) : undefined)
					}
					layout={EntityLayout.Title}
					open={false}
				/>
			</span>
		{:else}
			<ResourceBoundary resource={evmCoinInstance}>
				{#snippet Pending()}
					<span data-text="muted">
						<EvmNetworkView
							selection={select(EntityType.EvmNetwork, selection.entitySelector.$network)}
							href={
								(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
									caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
								}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
									networkSlug: String(selection.entitySelector.$network.slug),
								}) : undefined)
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}

				{#snippet children(entity)}
					<span data-text="muted">
						<EvmNetworkView
							selection={select(EntityType.EvmNetwork, selection.entitySelector.$network)}
							href={
								(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
									caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
								}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
									networkSlug: String(selection.entitySelector.$network.slug),
								}) : undefined)
							}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Coin ID</dt>
				<dd>
					<ResourceBoundary resource={evmCoinInstance}>
						{#snippet Pending()}
							{@const coinId = prefetched.coinId ?? selection.entitySelector.coinId}
							{#if coinId !== undefined && coinId !== null}
								{String((coinId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const coinId = entity.coinId ?? selection.entitySelector.coinId ?? prefetched.coinId}
							{#if coinId !== undefined && coinId !== null}
								{String((coinId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Type</dt>
				<dd>
					<ResourceBoundary resource={evmCoinInstance}>
						{#snippet Pending()}
							{@const type = prefetched.type ?? selection.entitySelector.type}
							{#if type !== undefined && type !== null}
								{String((type) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const type = entity.type ?? selection.entitySelector.type ?? prefetched.type}
							{#if type !== undefined && type !== null}
								{String((type) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Decimals</dt>
				<dd>
					<ResourceBoundary resource={evmCoinInstance}>
						{#snippet Pending()}
							{@const decimals = prefetched.decimals ?? selection.entitySelector.decimals}
							{#if decimals !== undefined && decimals !== null}
								{String((decimals) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const decimals = entity.decimals ?? selection.entitySelector.decimals ?? prefetched.decimals}
							{#if decimals !== undefined && decimals !== null}
								{String((decimals) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary resource={evmCoinInstance}>
				{#snippet Pending()}
					{@const caip19 = prefetched.caip19 ?? selection.entitySelector.caip19}
					{#if caip19 !== undefined && caip19 !== null}
						<div>
							<dt>CAIP-19</dt>
							<dd>
								{String((caip19) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const caip19 = entity.caip19 ?? selection.entitySelector.caip19 ?? prefetched.caip19}
					{#if caip19 !== undefined && caip19 !== null}
						<div>
							<dt>CAIP-19</dt>
							<dd>
								{String((caip19) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={evmCoinInstance}>
				{#snippet Pending()}
					{@const representation = prefetched.representation ?? selection.entitySelector.representation}
					{#if representation !== undefined && representation !== null}
						<div>
							<dt>Representation</dt>
							<dd>
								{String((representation) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const representation = entity.representation ?? selection.entitySelector.representation ?? prefetched.representation}
					{#if representation !== undefined && representation !== null}
						<div>
							<dt>Representation</dt>
							<dd>
								{String((representation) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary resource={evmCoinInstance}>
				{#snippet Pending()}
					{@const iconUrl = prefetched.iconUrl ?? selection.entitySelector.iconUrl}
					{#if iconUrl !== undefined && iconUrl !== null}
						<div>
							<dt>Icon URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(iconUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(iconUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const iconUrl = entity.iconUrl ?? selection.entitySelector.iconUrl ?? prefetched.iconUrl}
					{#if iconUrl !== undefined && iconUrl !== null}
						<div>
							<dt>Icon URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(iconUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(iconUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Contract</dt>
				<dd>
					<EvmContractView
						selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(contracts)/contract/[address=evmAddress]', {
								caip2: `${String(selection.entitySelector.$contract.$network.caip2.namespace)}:${String(selection.entitySelector.$contract.$network.caip2.reference)}`,
								address: String(selection.entitySelector.$contract.address),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.EvmCoinInstance, false>('$canonicalInstance')}
			>
				{#snippet children(evmCoinInstance)}
					{#if evmCoinInstance != null}
						<div>
							<dt>Canonical instance</dt>
							<dd>
								<EvmCoinInstanceView
									selection={select(EntityType.EvmCoinInstance, evmCoinInstance.entitySelector)}
									prefetched={evmCoinInstance}
									href={
										resolve('/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug]', {
											chainId: String(evmCoinInstance.entitySelector.$network.caip2.reference),
											coinInstanceSlug: String(
												(
													evmCoinInstance.entitySelector.type === 'NativeCurrency' ?
														'native'
													:
														evmCoinInstance.entitySelector.$contract.address
												)
											),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CoinBridgeCapabilitiesView
				selection={
						selection[EntityProxyField]<EntityType.CoinBridgeCapability>('$$outboundBridgeCapabilities', {
							sources: [
								Source.Lifi_Rest,
							],
						})
					}
				title='Outbound bridge capabilities'
				emptyText='No outbound bridge capabilities for this instance yet.'
				id='CoinBridgeCapabilitiesView-$$outboundBridgeCapabilities'
			/>

			<CoinBridgeCapabilitiesView
				selection={
						selection[EntityProxyField]<EntityType.CoinBridgeCapability>('$$inboundBridgeCapabilities', {
							sources: [
								Source.Lifi_Rest,
							],
						})
					}
				title='Inbound bridge capabilities'
				emptyText='No inbound bridge capabilities for this instance yet.'
				id='CoinBridgeCapabilitiesView-$$inboundBridgeCapabilities'
			/>

			<MarketsView
				selection={selection[EntityProxyField]<EntityType.Market>('$$marketsWithInstanceAsBase')}
				title='Markets with instance as base'
				href={resolve('/(assets)/markets')}
				emptyText='No markets use this instance as base yet.'
				id='MarketsView-$$marketsWithInstanceAsBase'
			/>

			<MarketsView
				selection={selection[EntityProxyField]<EntityType.Market>('$$marketsWithInstanceAsQuote')}
				title='Markets with instance as quote'
				href={resolve('/(assets)/markets')}
				emptyText='No markets use this instance as quote yet.'
				id='MarketsView-$$marketsWithInstanceAsQuote'
			/>
		{/if}
	{/snippet}
</EntityView>
