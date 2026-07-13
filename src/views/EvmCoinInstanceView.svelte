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

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const evmCoinInstance = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			symbol: true,
			name: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.symbol) ?? ''), String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || 'EVM coin instance')
	const viewDomId = $derived('evm-coin-instance-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
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
		href ?? (pendingEntity.type !== undefined && pendingEntity.type === 'NativeCurrency' && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.reference !== undefined ? resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
			chainId: String(pendingEntity.$network.caip2.reference ?? ''),
			coinInstanceSlug: String('native' ?? ''),
		}) : pendingEntity.type !== undefined && pendingEntity.type === 'Erc20Token' && pendingEntity.$contract !== undefined && pendingEntity.$contract.address !== undefined && pendingEntity.$network !== undefined && pendingEntity.$network.caip2 !== undefined && pendingEntity.$network.caip2.reference !== undefined ? resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
			coinInstanceSlug: String(pendingEntity.$contract.address ?? ''),
			chainId: String(pendingEntity.$network.caip2.reference ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmCoinInstance}>
			{#snippet Pending()}
				{[String((pendingEntity.symbol) ?? ''), String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || title || 'EVM coin instance'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.symbol) ?? ''), String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmCoinInstance}>
			{#snippet Pending()}
				{[String((pendingEntity.symbol) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.symbol) ?? ''), String((pendingEntity.name) ?? '')].filter(Boolean).join(' ') || title || 'EVM coin instance'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.symbol) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.symbol) ?? ''), String((resolvedEntity.name) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Symbol</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									symbol: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const symbol = pendingEntity.symbol}
							{#if symbol !== undefined && symbol !== null}
								{String((symbol) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const symbol = resolvedEntity.symbol}
							{#if symbol !== undefined && symbol !== null}
								{String((symbol) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							name: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const name = pendingEntity.name}
					{#if name !== undefined && name !== null}
						<div>
							<dt>Name</dt>
							<dd>
								{String((name) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const name = resolvedEntity.name}
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
							selection({
								fields: {
									coinId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const coinId = pendingEntity.coinId}
							{#if coinId !== undefined && coinId !== null}
								{String((coinId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const coinId = resolvedEntity.coinId}
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
					<ResourceBoundary
						resource={
							selection({
								fields: {
									type: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const type = pendingEntity.type}
							{#if type !== undefined && type !== null}
								{String((type) ?? '')}
							{/if}
						{/snippet}

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
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Decimals</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									decimals: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const decimals = pendingEntity.decimals}
							{#if decimals !== undefined && decimals !== null}
								{String((decimals) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const decimals = resolvedEntity.decimals}
							{#if decimals !== undefined && decimals !== null}
								{String((decimals) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							caip19: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const caip19 = pendingEntity.caip19}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const caip19 = resolvedEntity.caip19}
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
					selection({
						fields: {
							representation: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const representation = pendingEntity.representation}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const representation = resolvedEntity.representation}
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
					selection({
						fields: {
							iconUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const iconUrl = pendingEntity.iconUrl}
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
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const iconUrl = resolvedEntity.iconUrl}
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
				{#snippet Pending()}{/snippet}

				{#snippet children(evmContract)}
					{#if evmContract != null && evmContract[EntityMetaKey.Selector] != null}
						<div>
							<dt>Contract</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									href={
										(evmContract[EntityMetaKey.Selector].$network !== undefined && evmContract[EntityMetaKey.Selector].$network.slug !== undefined && evmContract[EntityMetaKey.Selector].address !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/contract/[address=evmAddress]', {
											network: String(evmContract[EntityMetaKey.Selector].$network.slug ?? ''),
											address: String(evmContract[EntityMetaKey.Selector].address ?? ''),
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
				resource={selection.$canonicalInstance}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(evmCoinInstance)}
					{#if evmCoinInstance != null && evmCoinInstance[EntityMetaKey.Selector] != null}
						<div>
							<dt>Canonical instance</dt>
							<dd>
								<EvmCoinInstanceView
									selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
									prefetched={evmCoinInstance}
									href={
										(evmCoinInstance[EntityMetaKey.Selector].type !== undefined && evmCoinInstance[EntityMetaKey.Selector].type === 'NativeCurrency' && evmCoinInstance[EntityMetaKey.Selector].$network !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2 !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference !== undefined ? resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
											chainId: String(evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference ?? ''),
											coinInstanceSlug: String('native' ?? ''),
										}) : evmCoinInstance[EntityMetaKey.Selector].type !== undefined && evmCoinInstance[EntityMetaKey.Selector].type === 'Erc20Token' && evmCoinInstance[EntityMetaKey.Selector].$contract !== undefined && evmCoinInstance[EntityMetaKey.Selector].$contract.address !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2 !== undefined && evmCoinInstance[EntityMetaKey.Selector].$network.caip2.reference !== undefined ? resolve('/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug=nativeCurrencySlugOrEvmAddress]', {
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
				resource={selection.$icon}
			>
				{#snippet Pending()}{/snippet}

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
											url: String(media[EntityMetaKey.Selector].url ?? ''),
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
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<CoinBridgeCapabilitiesView
				selection={
						selection.$$outboundBridgeCapabilities({
							sources: [
								Source.Lifi_Rest,
							],
						})
					}
				title='Outbound bridge capabilities'
				emptyText='No outbound bridge capabilities for this instance yet.'
				id='CoinBridgeCapabilitiesView-outbound-bridge-capabilities'
			/>

			<CoinBridgeCapabilitiesView
				selection={
						selection.$$inboundBridgeCapabilities({
							sources: [
								Source.Lifi_Rest,
							],
						})
					}
				title='Inbound bridge capabilities'
				emptyText='No inbound bridge capabilities for this instance yet.'
				id='CoinBridgeCapabilitiesView-inbound-bridge-capabilities'
			/>

			<MarketsView
				selection={selection.$$marketsWithInstanceAsBase}
				title='Markets with instance as base'
				href={resolve('/markets')}
				emptyText='No markets use this instance as base yet.'
				id='MarketsView-markets-with-instance-as-base'
			/>

			<MarketsView
				selection={selection.$$marketsWithInstanceAsQuote}
				title='Markets with instance as quote'
				href={resolve('/markets')}
				emptyText='No markets use this instance as quote yet.'
				id='MarketsView-markets-with-instance-as-quote'
			/>
		{/if}
	{/snippet}
</EntityView>
