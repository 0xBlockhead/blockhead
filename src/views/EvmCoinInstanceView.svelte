<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.EvmCoinInstance> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'EVM coin instance'


	// Components
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import CoinBridgeCapabilitiesView from '$/views/CoinBridgeCapabilitiesView.svelte'
	import MarketsView from '$/views/MarketsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import MediaView from '$/views/MediaView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmCoinInstance}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? (
			'caip2' in selection.entitySelector.$network
			&& (selection.entitySelector.type === 'NativeCurrency'
			|| (selection.entitySelector.type === 'Erc20Token'
			&& '$contract' in selection.entitySelector)) ?
				resolve(
					'/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]',
					{
						chainId: String(selection.entitySelector.$network.caip2.reference),
						coinInstanceSlug: (
							selection.entitySelector.type === 'NativeCurrency' ?
								'native'
							:
								String(selection.entitySelector.$contract.address)
						),
					}
				)
			:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<IconComponent />
	{/snippet}

	{#snippet Title()}
		<ProjectionBoundary
			resource={selection.NativeCurrency}
		>
			{#snippet Applicable(projection)}
				<ResourceBoundary
					resource={projection.symbol}
				>
					{#snippet children(symbol0)}
						{symbol0}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.NativeCurrency}
		>
			{#snippet Applicable(projection)}
				<ResourceBoundary
					resource={projection.name}
				>
					{#snippet children(name1)}
						{#if name1 != null}
							{name1}
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Erc20Token}
		>
			{#snippet Applicable(projection)}
				<ResourceBoundary
					resource={projection.symbol}
				>
					{#snippet children(symbol2)}
						{symbol2}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Erc20Token}
		>
			{#snippet Applicable(projection)}
				<ResourceBoundary
					resource={projection.name}
				>
					{#snippet children(name3)}
						{#if name3 != null}
							{name3}
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ProjectionBoundary>
	{/snippet}

	{#snippet Value()}
		<ProjectionBoundary
			resource={selection.NativeCurrency}
		>
			{#snippet Applicable(projection)}
				<ResourceBoundary
					resource={projection.symbol}
				>
					{#snippet children(symbol0)}
						{symbol0}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ProjectionBoundary>

		<ProjectionBoundary
			resource={selection.Erc20Token}
		>
			{#snippet Applicable(projection)}
				<ResourceBoundary
					resource={projection.symbol}
				>
					{#snippet children(symbol1)}
						{symbol1}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ProjectionBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Type</dt>
				<dd>
					{pendingEntity.type}
				</dd>
			</div>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$contract}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						<div>
							<dt>Contract</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			{#if selection.entitySelector.type === 'NativeCurrency'}
				<ProjectionBoundary
					resource={selection.NativeCurrency}
				>
					{#snippet Applicable(projection)}
						<div>
							<dt>Symbol</dt>
							<dd>
								<ResourceBoundary
									resource={projection.symbol}
								>
									{#snippet children(symbol)}
										{String(symbol)}
									{/snippet}
								</ResourceBoundary>
							</dd>
						</div>

						<ResourceBoundary
							resource={projection.name}
						>
							{#snippet children(name)}
								{#if name != null}
									<div>
										<dt>Name</dt>
										<dd>
											{name}
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>

						<div>
							<dt>Coin ID</dt>
							<dd>
								<ResourceBoundary
									resource={projection.coinId}
								>
									{#snippet children(coinId)}
										{String(coinId)}
									{/snippet}
								</ResourceBoundary>
							</dd>
						</div>
					{/snippet}
				</ProjectionBoundary>
			{/if}
		</dl>

		<dl data-column-item="center">
			{#if selection.entitySelector.type === 'NativeCurrency'}
				<ProjectionBoundary
					resource={selection.NativeCurrency}
				>
					{#snippet Applicable(projection)}
						<div>
							<dt>Decimals</dt>
							<dd>
								<ResourceBoundary
									resource={projection.decimals}
								>
									{#snippet children(decimals)}
										{String(decimals)}
									{/snippet}
								</ResourceBoundary>
							</dd>
						</div>

						<ResourceBoundary
							resource={projection.caip19}
						>
							{#snippet children(caip19)}
								{#if caip19 != null}
									<div>
										<dt>CAIP-19</dt>
										<dd>
											{caip19}
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>

						<ResourceBoundary
							resource={projection.representation}
						>
							{#snippet children(representation)}
								{#if representation != null}
									<div>
										<dt>Representation</dt>
										<dd>
											{representation}
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>

						<ResourceBoundary
							resource={projection.iconUrl}
						>
							{#snippet children(iconUrl)}
								{#if iconUrl != null}
									<div>
										<dt>Icon URL</dt>
										<dd>
											<a
												href={String(iconUrl)}
												target="_blank"
												rel="noreferrer noopener"
											>
												<TruncatedValue value={String(iconUrl)} />
											</a>
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/snippet}
				</ProjectionBoundary>
			{/if}
		</dl>

		<dl data-column-item="center">
			{#if selection.entitySelector.type === 'NativeCurrency'}
				<ProjectionBoundary
					resource={selection.NativeCurrency}
				>
					{#snippet Applicable(projection)}
						<ResourceBoundary
							resource={projection.$canonicalInstance}
						>
							{#snippet children(evmCoinInstance)}
								{#if evmCoinInstance != null}
									<div>
										<dt>Canonical instance</dt>
										<dd>
											<EvmCoinInstanceView
												selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
												prefetched={evmCoinInstance}
												layout={EntityLayout.Value}
												open={false}
											/>
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>

						<ResourceBoundary
							resource={projection.$icon}
						>
							{#snippet children(media)}
								{#if media != null}
									<div>
										<dt>Icon</dt>
										<dd>
											<MediaView
												selection={select(EntityType.Media, media[EntityMetaKey.Selector])}
												prefetched={media}
												layout={EntityLayout.Value}
												open={false}
											/>
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/snippet}
				</ProjectionBoundary>
			{/if}
		</dl>

		<dl data-column-item="center">
			{#if selection.entitySelector.type === 'Erc20Token'}
				<ProjectionBoundary
					resource={selection.Erc20Token}
				>
					{#snippet Applicable(projection)}
						<div>
							<dt>Symbol</dt>
							<dd>
								<ResourceBoundary
									resource={projection.symbol}
								>
									{#snippet children(symbol)}
										{String(symbol)}
									{/snippet}
								</ResourceBoundary>
							</dd>
						</div>

						<ResourceBoundary
							resource={projection.name}
						>
							{#snippet children(name)}
								{#if name != null}
									<div>
										<dt>Name</dt>
										<dd>
											{name}
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>

						<div>
							<dt>Coin ID</dt>
							<dd>
								<ResourceBoundary
									resource={projection.coinId}
								>
									{#snippet children(coinId)}
										{String(coinId)}
									{/snippet}
								</ResourceBoundary>
							</dd>
						</div>
					{/snippet}
				</ProjectionBoundary>
			{/if}
		</dl>

		<dl data-column-item="center">
			{#if selection.entitySelector.type === 'Erc20Token'}
				<ProjectionBoundary
					resource={selection.Erc20Token}
				>
					{#snippet Applicable(projection)}
						<div>
							<dt>Decimals</dt>
							<dd>
								<ResourceBoundary
									resource={projection.decimals}
								>
									{#snippet children(decimals)}
										{String(decimals)}
									{/snippet}
								</ResourceBoundary>
							</dd>
						</div>

						<ResourceBoundary
							resource={projection.caip19}
						>
							{#snippet children(caip19)}
								{#if caip19 != null}
									<div>
										<dt>CAIP-19</dt>
										<dd>
											{caip19}
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>

						<ResourceBoundary
							resource={projection.representation}
						>
							{#snippet children(representation)}
								{#if representation != null}
									<div>
										<dt>Representation</dt>
										<dd>
											{representation}
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>

						<ResourceBoundary
							resource={projection.iconUrl}
						>
							{#snippet children(iconUrl)}
								{#if iconUrl != null}
									<div>
										<dt>Icon URL</dt>
										<dd>
											<a
												href={String(iconUrl)}
												target="_blank"
												rel="noreferrer noopener"
											>
												<TruncatedValue value={String(iconUrl)} />
											</a>
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/snippet}
				</ProjectionBoundary>
			{/if}
		</dl>

		<dl data-column-item="center">
			{#if selection.entitySelector.type === 'Erc20Token'}
				<ProjectionBoundary
					resource={selection.Erc20Token}
				>
					{#snippet Applicable(projection)}
						<ResourceBoundary
							resource={projection.$canonicalInstance}
						>
							{#snippet children(evmCoinInstance)}
								{#if evmCoinInstance != null}
									<div>
										<dt>Canonical instance</dt>
										<dd>
											<EvmCoinInstanceView
												selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
												prefetched={evmCoinInstance}
												layout={EntityLayout.Value}
												open={false}
											/>
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>

						<ResourceBoundary
							resource={projection.$icon}
						>
							{#snippet children(media)}
								{#if media != null}
									<div>
										<dt>Icon</dt>
										<dd>
											<MediaView
												selection={select(EntityType.Media, media[EntityMetaKey.Selector])}
												prefetched={media}
												layout={EntityLayout.Value}
												open={false}
											/>
										</dd>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					{/snippet}
				</ProjectionBoundary>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if selection.entitySelector.type === 'NativeCurrency'}
			<ProjectionBoundary
				resource={selection.NativeCurrency}
			>
				{#snippet Applicable(projection)}
					{@const evmCoinInstanceCoinBridgeCapabilitiesViewNativeCurrencyOutboundBridgeCapabilitiesResource = projection
					.$$outboundBridgeCapabilities({
						sources: [
							Source.Lifi_Rest,
						],
					})}
					<ResourceBoundary
						resource={evmCoinInstanceCoinBridgeCapabilitiesViewNativeCurrencyOutboundBridgeCapabilitiesResource}
					>
						{#snippet children(entities)}
							{#if entities.values.length > 0}
								<CoinBridgeCapabilitiesView
									selection={evmCoinInstanceCoinBridgeCapabilitiesViewNativeCurrencyOutboundBridgeCapabilitiesResource}
									countResource={evmCoinInstanceCoinBridgeCapabilitiesViewNativeCurrencyOutboundBridgeCapabilitiesResource.count}
									title='Outbound bridge capabilities'
									id='outbound-bridge-capabilities'
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ProjectionBoundary>
		{/if}

		{#if selection.entitySelector.type === 'NativeCurrency'}
			<ProjectionBoundary
				resource={selection.NativeCurrency}
			>
				{#snippet Applicable(projection)}
					{@const evmCoinInstanceCoinBridgeCapabilitiesViewNativeCurrencyInboundBridgeCapabilitiesResource = projection
					.$$inboundBridgeCapabilities({
						sources: [
							Source.Lifi_Rest,
						],
					})}
					<ResourceBoundary
						resource={evmCoinInstanceCoinBridgeCapabilitiesViewNativeCurrencyInboundBridgeCapabilitiesResource}
					>
						{#snippet children(entities)}
							{#if entities.values.length > 0}
								<CoinBridgeCapabilitiesView
									selection={evmCoinInstanceCoinBridgeCapabilitiesViewNativeCurrencyInboundBridgeCapabilitiesResource}
									countResource={evmCoinInstanceCoinBridgeCapabilitiesViewNativeCurrencyInboundBridgeCapabilitiesResource.count}
									title='Inbound bridge capabilities'
									id='inbound-bridge-capabilities'
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ProjectionBoundary>
		{/if}

		{#if selection.entitySelector.type === 'NativeCurrency'}
			<ProjectionBoundary
				resource={selection.NativeCurrency}
			>
				{#snippet Applicable(projection)}
					{@const evmCoinInstanceMarketsViewNativeCurrencyMarketsWithInstanceAsBaseResource = projection.$$marketsWithInstanceAsBase}
					<ResourceBoundary
						resource={evmCoinInstanceMarketsViewNativeCurrencyMarketsWithInstanceAsBaseResource}
					>
						{#snippet children(entities)}
							{#if entities.values.length > 0}
								<MarketsView
									selection={evmCoinInstanceMarketsViewNativeCurrencyMarketsWithInstanceAsBaseResource}
									countResource={evmCoinInstanceMarketsViewNativeCurrencyMarketsWithInstanceAsBaseResource.count}
									title='Markets with instance as base'
									href={resolve('/(assets)/markets')}
									id='markets-with-instance-as-base'
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ProjectionBoundary>
		{/if}

		{#if selection.entitySelector.type === 'NativeCurrency'}
			<ProjectionBoundary
				resource={selection.NativeCurrency}
			>
				{#snippet Applicable(projection)}
					{@const evmCoinInstanceMarketsViewNativeCurrencyMarketsWithInstanceAsQuoteResource = projection.$$marketsWithInstanceAsQuote}
					<ResourceBoundary
						resource={evmCoinInstanceMarketsViewNativeCurrencyMarketsWithInstanceAsQuoteResource}
					>
						{#snippet children(entities)}
							{#if entities.values.length > 0}
								<MarketsView
									selection={evmCoinInstanceMarketsViewNativeCurrencyMarketsWithInstanceAsQuoteResource}
									countResource={evmCoinInstanceMarketsViewNativeCurrencyMarketsWithInstanceAsQuoteResource.count}
									title='Markets with instance as quote'
									href={resolve('/(assets)/markets')}
									id='markets-with-instance-as-quote'
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ProjectionBoundary>
		{/if}

		{#if selection.entitySelector.type === 'Erc20Token'}
			<ProjectionBoundary
				resource={selection.Erc20Token}
			>
				{#snippet Applicable(projection)}
					{@const evmCoinInstanceCoinBridgeCapabilitiesViewErc20TokenOutboundBridgeCapabilitiesResource = projection
					.$$outboundBridgeCapabilities({
						sources: [
							Source.Lifi_Rest,
						],
					})}
					<ResourceBoundary
						resource={evmCoinInstanceCoinBridgeCapabilitiesViewErc20TokenOutboundBridgeCapabilitiesResource}
					>
						{#snippet children(entities)}
							{#if entities.values.length > 0}
								<CoinBridgeCapabilitiesView
									selection={evmCoinInstanceCoinBridgeCapabilitiesViewErc20TokenOutboundBridgeCapabilitiesResource}
									countResource={evmCoinInstanceCoinBridgeCapabilitiesViewErc20TokenOutboundBridgeCapabilitiesResource.count}
									title='Outbound bridge capabilities'
									id='outbound-bridge-capabilities'
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ProjectionBoundary>
		{/if}

		{#if selection.entitySelector.type === 'Erc20Token'}
			<ProjectionBoundary
				resource={selection.Erc20Token}
			>
				{#snippet Applicable(projection)}
					{@const evmCoinInstanceCoinBridgeCapabilitiesViewErc20TokenInboundBridgeCapabilitiesResource = projection
					.$$inboundBridgeCapabilities({
						sources: [
							Source.Lifi_Rest,
						],
					})}
					<ResourceBoundary
						resource={evmCoinInstanceCoinBridgeCapabilitiesViewErc20TokenInboundBridgeCapabilitiesResource}
					>
						{#snippet children(entities)}
							{#if entities.values.length > 0}
								<CoinBridgeCapabilitiesView
									selection={evmCoinInstanceCoinBridgeCapabilitiesViewErc20TokenInboundBridgeCapabilitiesResource}
									countResource={evmCoinInstanceCoinBridgeCapabilitiesViewErc20TokenInboundBridgeCapabilitiesResource.count}
									title='Inbound bridge capabilities'
									id='inbound-bridge-capabilities'
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ProjectionBoundary>
		{/if}

		{#if selection.entitySelector.type === 'Erc20Token'}
			<ProjectionBoundary
				resource={selection.Erc20Token}
			>
				{#snippet Applicable(projection)}
					{@const evmCoinInstanceMarketsViewErc20TokenMarketsWithInstanceAsBaseResource = projection.$$marketsWithInstanceAsBase}
					<ResourceBoundary
						resource={evmCoinInstanceMarketsViewErc20TokenMarketsWithInstanceAsBaseResource}
					>
						{#snippet children(entities)}
							{#if entities.values.length > 0}
								<MarketsView
									selection={evmCoinInstanceMarketsViewErc20TokenMarketsWithInstanceAsBaseResource}
									countResource={evmCoinInstanceMarketsViewErc20TokenMarketsWithInstanceAsBaseResource.count}
									title='Markets with instance as base'
									href={resolve('/(assets)/markets')}
									id='markets-with-instance-as-base'
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ProjectionBoundary>
		{/if}

		{#if selection.entitySelector.type === 'Erc20Token'}
			<ProjectionBoundary
				resource={selection.Erc20Token}
			>
				{#snippet Applicable(projection)}
					{@const evmCoinInstanceMarketsViewErc20TokenMarketsWithInstanceAsQuoteResource = projection.$$marketsWithInstanceAsQuote}
					<ResourceBoundary
						resource={evmCoinInstanceMarketsViewErc20TokenMarketsWithInstanceAsQuoteResource}
					>
						{#snippet children(entities)}
							{#if entities.values.length > 0}
								<MarketsView
									selection={evmCoinInstanceMarketsViewErc20TokenMarketsWithInstanceAsQuoteResource}
									countResource={evmCoinInstanceMarketsViewErc20TokenMarketsWithInstanceAsQuoteResource.count}
									title='Markets with instance as quote'
									href={resolve('/(assets)/markets')}
									id='markets-with-instance-as-quote'
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ProjectionBoundary>
		{/if}
	{/snippet}
</EntityView>
