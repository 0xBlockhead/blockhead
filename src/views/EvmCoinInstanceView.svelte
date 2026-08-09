<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.EvmCoinInstance>, 'prefetched'> = $props()


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
	title={title ?? 'EVM coin instance'}
	href={
		href === undefined ?
			(
				'caip2' in selection.entitySelector.$network
				&& (
					selection.entitySelector.type === 'NativeCurrency'
					|| (
						selection.entitySelector.type === 'Erc20Token'
						&& '$contract' in selection.entitySelector
					)
				) ?
					resolve(
						'/(assets)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]',
						{
							chainId: selection.entitySelector.$network.caip2.reference,
							coinInstanceSlug: (
								selection.entitySelector.type === 'NativeCurrency' ?
									'native'
								:
									selection.entitySelector.$contract.address
							),
						}
					)
				:
					undefined
			)
		:
			href ?? undefined
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
					{#snippet children(symbol1)}
						{symbol1}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary
					resource={projection.name}
				>
					{#snippet children(name2)}
						{#if name2 != null}
							{name2}
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
					{#snippet children(symbol3)}
						{symbol3}
					{/snippet}
				</ResourceBoundary>

				<ResourceBoundary
					resource={projection.name}
				>
					{#snippet children(name4)}
						{#if name4 != null}
							{name4}
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
					{#snippet children(symbol1)}
						{symbol1}
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
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Type</dt>
				<dd>
					{selection.entitySelector.type}
				</dd>
			</div>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Contract</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$contract}
					>
						{#snippet children(evmContract)}
							<EvmContractView
								selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
								prefetched={evmContract}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<ProjectionBoundary
			resource={
				selection.entitySelector.type === 'NativeCurrency' ?
					selection.NativeCurrency
				:
					selection.Erc20Token
			}
		>
			{#snippet Applicable(projection)}
				<dl data-column-item="center">
					<div>
						<dt>Symbol</dt>
						<dd>
							<ResourceBoundary
								resource={projection.symbol}
							>
								{#snippet children(symbol)}
									{symbol}
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
									{coinId}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				</dl>

				<dl data-column-item="center">
					<div>
						<dt>Decimals</dt>
						<dd>
							<ResourceBoundary
								resource={projection.decimals}
							>
								{#snippet children(decimals)}
									{decimals}
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
											href={iconUrl}
											target="_blank"
											rel="noreferrer noopener"
										>
											<TruncatedValue value={iconUrl} />
										</a>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dl>

				<dl data-column-item="center">
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
											layout={EntityLayout.Value}
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
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dl>
			{/snippet}
		</ProjectionBoundary>
	{/snippet}

	{#snippet Details()}
		<ProjectionBoundary
			resource={
				selection.entitySelector.type === 'NativeCurrency' ?
					selection.NativeCurrency
				:
					selection.Erc20Token
			}
		>
			{#snippet Applicable(projection)}
				{@const outboundBridgeCapabilitiesResource = projection
					.$$outboundBridgeCapabilities({
						sources: [
							Source.Lifi_Rest,
						],
					})}
				<ResourceBoundary
					resource={outboundBridgeCapabilitiesResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
							<CoinBridgeCapabilitiesView
								selection={outboundBridgeCapabilitiesResource}
								countResource={outboundBridgeCapabilitiesResource.count}
								title='Outbound bridge capabilities'
								id='outbound-bridge-capabilities'
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>

				{@const inboundBridgeCapabilitiesResource = projection
					.$$inboundBridgeCapabilities({
						sources: [
							Source.Lifi_Rest,
						],
					})}
				<ResourceBoundary
					resource={inboundBridgeCapabilitiesResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
							<CoinBridgeCapabilitiesView
								selection={inboundBridgeCapabilitiesResource}
								countResource={inboundBridgeCapabilitiesResource.count}
								title='Inbound bridge capabilities'
								id='inbound-bridge-capabilities'
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>

				{@const marketsWithInstanceAsBaseResource = projection.$$marketsWithInstanceAsBase}
				<ResourceBoundary
					resource={marketsWithInstanceAsBaseResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
							<MarketsView
								selection={marketsWithInstanceAsBaseResource}
								countResource={marketsWithInstanceAsBaseResource.count}
								title='Markets with instance as base'
								href={resolve('/(assets)/markets')}
								id='markets-with-instance-as-base'
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>

				{@const marketsWithInstanceAsQuoteResource = projection.$$marketsWithInstanceAsQuote}
				<ResourceBoundary
					resource={marketsWithInstanceAsQuoteResource}
				>
					{#snippet children(entities)}
						{#if entities.values.length > 0}
							<MarketsView
								selection={marketsWithInstanceAsQuoteResource}
								countResource={marketsWithInstanceAsQuoteResource.count}
								title='Markets with instance as quote'
								href={resolve('/(assets)/markets')}
								id='markets-with-instance-as-quote'
							/>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ProjectionBoundary>
	{/snippet}
</EntityView>
