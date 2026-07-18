<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import ProjectionBoundary from '$/components/ProjectionBoundary.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.EvmCoinInstance>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.EvmCoinInstance>>
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
	const evmCoinInstance = $derived(selection({
		sources: selection.sources,
	}))
	const titleFallback = $derived('EVM coin instance')
	const viewDomId = $derived('evm-coin-instance-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.type === 'NativeCurrency' && pendingEntity.type === 'NativeCurrency' && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.reference !== undefined ? resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
			chainId: String(pendingEntity.$network.caip2.reference ?? ''),
			coinInstanceSlug: String('native' ?? ''),
		}) : pendingEntity.type === 'Erc20Token' && pendingEntity.type === 'Erc20Token' && pendingEntity.$contract !== undefined && pendingEntity.$contract.address !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.reference !== undefined ? resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
			coinInstanceSlug: String(pendingEntity.$contract.address ?? ''),
			chainId: String(pendingEntity.$network.caip2.reference ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>

	{#snippet Icon()}
		<ResourceBoundary resource={evmCoinInstance}>
			{#snippet children(entity)}
				<IconComponent />
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const symbol0 = pendingEntity.NativeCurrency?.fields.symbol}
					{#if symbol0 !== undefined && symbol0 !== null}
						{String((symbol0) ?? '')}
					{/if}
					{@const name1 = pendingEntity.NativeCurrency?.fields.name}
					{#if name1 !== undefined && name1 !== null}
						{String((name1) ?? '')}
					{/if}
					{@const symbol2 = pendingEntity.Erc20Token?.fields.symbol}
					{#if symbol2 !== undefined && symbol2 !== null}
						{String((symbol2) ?? '')}
					{/if}
					{@const name3 = pendingEntity.Erc20Token?.fields.name}
					{#if name3 !== undefined && name3 !== null}
						{String((name3) ?? '')}
					{/if}
		{:else}
			<ResourceBoundary resource={evmCoinInstance}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ProjectionBoundary
						resource={selection.NativeCurrency}
					>
						{#snippet Applicable(projection)}
							<ResourceBoundary
								resource={
								projection.symbol({
									sources: [
										Source.Constants_Internal,
									],
									fields: {
										symbol: true,
									},
								})
							}
							>
								{#snippet children(symbol0)}
									{#if symbol0 !== undefined && symbol0 !== null}
										{String((symbol0) ?? '')}
									{/if}
								{/snippet}
							</ResourceBoundary>
						{/snippet}
					</ProjectionBoundary>

					<ProjectionBoundary
						resource={selection.NativeCurrency}
					>
						{#snippet Applicable(projection)}
							<ResourceBoundary
								resource={
								projection.name({
									sources: [
										Source.Constants_Internal,
									],
									fields: {
										name: true,
									},
								})
							}
							>
								{#snippet children(name1)}
									{#if name1 !== undefined && name1 !== null}
										{String((name1) ?? '')}
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
								resource={
								projection.symbol({
									sources: [
										Source.Blockscout_Rest,
										Source.Constants_Internal,
									],
									fields: {
										symbol: true,
									},
								})
							}
							>
								{#snippet children(symbol2)}
									{#if symbol2 !== undefined && symbol2 !== null}
										{String((symbol2) ?? '')}
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
								resource={
								projection.name({
									sources: [
										Source.Blockscout_Rest,
										Source.Constants_Internal,
									],
									fields: {
										name: true,
									},
								})
							}
							>
								{#snippet children(name3)}
									{#if name3 !== undefined && name3 !== null}
										{String((name3) ?? '')}
									{/if}
								{/snippet}
							</ResourceBoundary>
						{/snippet}
					</ProjectionBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const symbol0 = pendingEntity.NativeCurrency?.fields.symbol}
					{#if symbol0 !== undefined && symbol0 !== null}
						{String((symbol0) ?? '')}
					{/if}
					{@const symbol1 = pendingEntity.Erc20Token?.fields.symbol}
					{#if symbol1 !== undefined && symbol1 !== null}
						{String((symbol1) ?? '')}
					{/if}
		{:else}
			<ResourceBoundary resource={evmCoinInstance}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ProjectionBoundary
						resource={selection.NativeCurrency}
					>
						{#snippet Applicable(projection)}
							<ResourceBoundary
								resource={
								projection.symbol({
									sources: [
										Source.Constants_Internal,
									],
									fields: {
										symbol: true,
									},
								})
							}
							>
								{#snippet children(symbol0)}
									{#if symbol0 !== undefined && symbol0 !== null}
										{String((symbol0) ?? '')}
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
								resource={
								projection.symbol({
									sources: [
										Source.Blockscout_Rest,
										Source.Constants_Internal,
									],
									fields: {
										symbol: true,
									},
								})
							}
							>
								{#snippet children(symbol1)}
									{#if symbol1 !== undefined && symbol1 !== null}
										{String((symbol1) ?? '')}
									{/if}
								{/snippet}
							</ResourceBoundary>
						{/snippet}
					</ProjectionBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Type</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									type: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const type = resolvedEntity.type}
							{#if type !== undefined && type !== null}
								{String((type) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$contract}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null && evmContract[EntityMetaKey.Selector] != null}
						<div>
							<dt>Contract</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									href={
										(evmContract[EntityMetaKey.Selector].address !== undefined && evmContract[EntityMetaKey.Selector].$network !== undefined && evmContract[EntityMetaKey.Selector].$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
											address: String(evmContract[EntityMetaKey.Selector].address ?? ''),
											network: String(caip2StringFromValue(evmContract[EntityMetaKey.Selector].$network.caip2) ?? ''),
										}) : evmContract[EntityMetaKey.Selector].address !== undefined && evmContract[EntityMetaKey.Selector].$network !== undefined && evmContract[EntityMetaKey.Selector].$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
											address: String(evmContract[EntityMetaKey.Selector].address ?? ''),
											network: String(evmContract[EntityMetaKey.Selector].$network.slug ?? ''),
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
		</dl>

		<dl data-column-item="center">
			<ProjectionBoundary
				resource={selection.NativeCurrency}
			>
				{#snippet Applicable(projection)}
					<div>
						<dt>Symbol</dt>
						<dd>
							<ResourceBoundary
								resource={
									projection.symbol({
										sources: [
											Source.Constants_Internal,
										],
									})
								}
							>
								{#snippet children(symbol)}
									{#if symbol !== undefined && symbol !== null}
										{String((symbol) ?? '')}
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>

					<ResourceBoundary
						resource={
							projection.name({
								sources: [
									Source.Constants_Internal,
								],
							})
						}
					>
						{#snippet children(name)}
							{#if name !== undefined && name !== null}
								<div>
									<dt>Name</dt>
									<dd>
										{String((name) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<div>
						<dt>Coin ID</dt>
						<dd>
							<ResourceBoundary
								resource={
									projection.coinId({
										sources: [
											Source.Constants_Internal,
										],
									})
								}
							>
								{#snippet children(coinId)}
									{#if coinId !== undefined && coinId !== null}
										{String((coinId) ?? '')}
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/snippet}
			</ProjectionBoundary>
		</dl>

		<dl data-column-item="center">
			<ProjectionBoundary
				resource={selection.NativeCurrency}
			>
				{#snippet Applicable(projection)}
					<div>
						<dt>Decimals</dt>
						<dd>
							<ResourceBoundary
								resource={
									projection.decimals({
										sources: [
											Source.Constants_Internal,
										],
									})
								}
							>
								{#snippet children(decimals)}
									{#if decimals !== undefined && decimals !== null}
										{String((decimals) ?? '')}
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>

					<ResourceBoundary
						resource={
							projection.caip19({
								sources: [
									Source.Constants_Internal,
								],
							})
						}
					>
						{#snippet children(caip19)}
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

					<ResourceBoundary
						resource={
							projection.representation({
								sources: [
									Source.Constants_Internal,
									Source.Coingecko_Rest,
								],
							})
						}
					>
						{#snippet children(representation)}
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

					<ResourceBoundary
						resource={projection.iconUrl}
					>
						{#snippet children(iconUrl)}
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
				{/snippet}
			</ProjectionBoundary>
		</dl>

		<dl data-column-item="center">
			<ProjectionBoundary
				resource={selection.NativeCurrency}
			>
				{#snippet Applicable(projection)}
					<ResourceBoundary
						resource={
							projection.$canonicalInstance({
								sources: [
									Source.Coingecko_Rest,
								],
							})
						}
					>
						{#snippet children(evmCoinInstance)}
							{#if evmCoinInstance != null && evmCoinInstance[EntityMetaKey.Selector] != null}
								<div>
									<dt>Canonical instance</dt>
									<dd>
										<EvmCoinInstanceView
											selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
											prefetched={evmCoinInstance}
											href={
												(evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' && evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' && evmCoinInstance[EntityMetaKey.Selector].$network !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2 !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference !== undefined ? resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
													chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
													coinInstanceSlug: String('native' ?? ''),
												}) : evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token' && evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token' && evmCoinInstance[EntityMetaKey.Selector].$contract !== undefined && evmCoinInstance[EntityMetaKey.Selector].$contract.address !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2 !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference !== undefined ? resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
													coinInstanceSlug: String(evmCoinInstance[EntityMetaKey.Selector].$contract.address ?? ''),
													chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
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
						resource={projection.$icon}
					>
						{#snippet children(media)}
							{#if media != null && media[EntityMetaKey.Selector] != null}
								<div>
									<dt>Icon</dt>
									<dd>
										<MediaView
											selection={select(EntityType.Media, media[EntityMetaKey.Selector])}
											prefetched={media}
											href={
												(media[EntityMetaKey.Selector].url !== undefined ? resolve('/media/[url=absoluteUrl]', {
													url: encodeURIComponent(String(media[EntityMetaKey.Selector].url ?? '')),
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
				{/snippet}
			</ProjectionBoundary>
		</dl>

		<dl data-column-item="center">
			<ProjectionBoundary
				resource={selection.Erc20Token}
			>
				{#snippet Applicable(projection)}
					<div>
						<dt>Symbol</dt>
						<dd>
							<ResourceBoundary
								resource={
									projection.symbol({
										sources: [
											Source.Blockscout_Rest,
											Source.Constants_Internal,
										],
									})
								}
							>
								{#snippet children(symbol)}
									{#if symbol !== undefined && symbol !== null}
										{String((symbol) ?? '')}
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>

					<ResourceBoundary
						resource={
							projection.name({
								sources: [
									Source.Blockscout_Rest,
									Source.Constants_Internal,
								],
							})
						}
					>
						{#snippet children(name)}
							{#if name !== undefined && name !== null}
								<div>
									<dt>Name</dt>
									<dd>
										{String((name) ?? '')}
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

					<div>
						<dt>Coin ID</dt>
						<dd>
							<ResourceBoundary
								resource={
									projection.coinId({
										sources: [
											Source.Blockscout_Rest,
											Source.Constants_Internal,
										],
									})
								}
							>
								{#snippet children(coinId)}
									{#if coinId !== undefined && coinId !== null}
										{String((coinId) ?? '')}
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>
				{/snippet}
			</ProjectionBoundary>
		</dl>

		<dl data-column-item="center">
			<ProjectionBoundary
				resource={selection.Erc20Token}
			>
				{#snippet Applicable(projection)}
					<div>
						<dt>Decimals</dt>
						<dd>
							<ResourceBoundary
								resource={
									projection.decimals({
										sources: [
											Source.Blockscout_Rest,
											Source.Constants_Internal,
										],
									})
								}
							>
								{#snippet children(decimals)}
									{#if decimals !== undefined && decimals !== null}
										{String((decimals) ?? '')}
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dd>
					</div>

					<ResourceBoundary
						resource={
							projection.caip19({
								sources: [
									Source.Constants_Internal,
									Source.Coingecko_Rest,
								],
							})
						}
					>
						{#snippet children(caip19)}
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

					<ResourceBoundary
						resource={
							projection.representation({
								sources: [
									Source.Coingecko_Rest,
								],
							})
						}
					>
						{#snippet children(representation)}
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

					<ResourceBoundary
						resource={
							projection.iconUrl({
								sources: [
									Source.Blockscout_Rest,
								],
							})
						}
					>
						{#snippet children(iconUrl)}
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
				{/snippet}
			</ProjectionBoundary>
		</dl>

		<dl data-column-item="center">
			<ProjectionBoundary
				resource={selection.Erc20Token}
			>
				{#snippet Applicable(projection)}
					<ResourceBoundary
						resource={
							projection.$canonicalInstance({
								sources: [
									Source.Coingecko_Rest,
								],
							})
						}
					>
						{#snippet children(evmCoinInstance)}
							{#if evmCoinInstance != null && evmCoinInstance[EntityMetaKey.Selector] != null}
								<div>
									<dt>Canonical instance</dt>
									<dd>
										<EvmCoinInstanceView
											selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
											prefetched={evmCoinInstance}
											href={
												(evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' && evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' && evmCoinInstance[EntityMetaKey.Selector].$network !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2 !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference !== undefined ? resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
													chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
													coinInstanceSlug: String('native' ?? ''),
												}) : evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token' && evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token' && evmCoinInstance[EntityMetaKey.Selector].$contract !== undefined && evmCoinInstance[EntityMetaKey.Selector].$contract.address !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2 !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference !== undefined ? resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
													coinInstanceSlug: String(evmCoinInstance[EntityMetaKey.Selector].$contract.address ?? ''),
													chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
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
						resource={projection.$icon}
					>
						{#snippet children(media)}
							{#if media != null && media[EntityMetaKey.Selector] != null}
								<div>
									<dt>Icon</dt>
									<dd>
										<MediaView
											selection={select(EntityType.Media, media[EntityMetaKey.Selector])}
											prefetched={media}
											href={
												(media[EntityMetaKey.Selector].url !== undefined ? resolve('/media/[url=absoluteUrl]', {
													url: encodeURIComponent(String(media[EntityMetaKey.Selector].url ?? '')),
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
				{/snippet}
			</ProjectionBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<ProjectionBoundary
				resource={selection.NativeCurrency}
			>
				{#snippet Applicable(projection)}
					<CoinBridgeCapabilitiesView
						selection={
							projection.$$outboundBridgeCapabilities({
								sources: [
									Source.Lifi_Rest,
								],
								count: true,
							})
						}
						title='Outbound bridge capabilities'
						emptyText='No outbound bridge capabilities for this instance yet.'
						id='CoinBridgeCapabilitiesView-outbound-bridge-capabilities'
					/>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.NativeCurrency}
			>
				{#snippet Applicable(projection)}
					<CoinBridgeCapabilitiesView
						selection={
							projection.$$inboundBridgeCapabilities({
								sources: [
									Source.Lifi_Rest,
								],
								count: true,
							})
						}
						title='Inbound bridge capabilities'
						emptyText='No inbound bridge capabilities for this instance yet.'
						id='CoinBridgeCapabilitiesView-inbound-bridge-capabilities'
					/>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.NativeCurrency}
			>
				{#snippet Applicable(projection)}
					<MarketsView
						selection={
							projection.$$marketsWithInstanceAsBase({
								count: true,
							})
						}
						title='Markets with instance as base'
						href={resolve('/markets')}
						emptyText='No markets use this instance as base yet.'
						id='MarketsView-markets-with-instance-as-base'
					/>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.NativeCurrency}
			>
				{#snippet Applicable(projection)}
					<MarketsView
						selection={
							projection.$$marketsWithInstanceAsQuote({
								count: true,
							})
						}
						title='Markets with instance as quote'
						href={resolve('/markets')}
						emptyText='No markets use this instance as quote yet.'
						id='MarketsView-markets-with-instance-as-quote'
					/>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Erc20Token}
			>
				{#snippet Applicable(projection)}
					<CoinBridgeCapabilitiesView
						selection={
							projection.$$outboundBridgeCapabilities({
								sources: [
									Source.Lifi_Rest,
								],
								count: true,
							})
						}
						title='Outbound bridge capabilities'
						emptyText='No outbound bridge capabilities for this instance yet.'
						id='CoinBridgeCapabilitiesView-outbound-bridge-capabilities'
					/>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Erc20Token}
			>
				{#snippet Applicable(projection)}
					<CoinBridgeCapabilitiesView
						selection={
							projection.$$inboundBridgeCapabilities({
								sources: [
									Source.Lifi_Rest,
								],
								count: true,
							})
						}
						title='Inbound bridge capabilities'
						emptyText='No inbound bridge capabilities for this instance yet.'
						id='CoinBridgeCapabilitiesView-inbound-bridge-capabilities'
					/>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Erc20Token}
			>
				{#snippet Applicable(projection)}
					<MarketsView
						selection={
							projection.$$marketsWithInstanceAsBase({
								count: true,
							})
						}
						title='Markets with instance as base'
						href={resolve('/markets')}
						emptyText='No markets use this instance as base yet.'
						id='MarketsView-markets-with-instance-as-base'
					/>
				{/snippet}
			</ProjectionBoundary>

			<ProjectionBoundary
				resource={selection.Erc20Token}
			>
				{#snippet Applicable(projection)}
					<MarketsView
						selection={
							projection.$$marketsWithInstanceAsQuote({
								count: true,
							})
						}
						title='Markets with instance as quote'
						href={resolve('/markets')}
						emptyText='No markets use this instance as quote yet.'
						id='MarketsView-markets-with-instance-as-quote'
					/>
				{/snippet}
			</ProjectionBoundary>
		{/if}
	{/snippet}
</EntityView>
