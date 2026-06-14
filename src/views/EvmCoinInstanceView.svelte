<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
	import { schema } from '$/schema/index.ts'
	import { coinInstanceRepresentationByRepresentation } from '$/constants/Bridge.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		RouteContent,
		selector,
		href,
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			RouteContent?: Snippet
			selector: EntitySelector<typeof schema, EntityType.EvmCoinInstance>
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
			| 'title'
		>
	> = $props()

	import { evmChainIdFromCaip2 } from '$/lib/caip.ts'
	import { subscribe } from '$/routes/+layout.svelte'

	const coinInstance = subscribe(EntityType.EvmCoinInstance,
		selector,
		({ sources: [
				Source.Coingecko_Rest,
				Source.Constants_Internal,
				Source.Lifi_Rest,
			], fields: { coinId: true, $icon: true, name: true, symbol: true, ...(open ? ({ decimals: true, caip19: true, representation: true, $canonicalInstance: ({ sources: [Source.Coingecko_Rest] }), $$outboundBridgeCapabilities: ({ sources: [Source.Lifi_Rest] }), $$inboundBridgeCapabilities: ({ sources: [Source.Lifi_Rest] }) }) : ({  })) } }),
	)

	const network = subscribe(EntityType.EvmNetwork,
		selector.$network,
		({ sources: [
				Source.Constants_Internal,
				Source.Chainlist_Rest,
				Source.EthereumLists_Rest,
			], fields: { name: true } }),
	)


	// (Derived)
	const coinInstanceKey = $derived(
		stringify(selector),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CoinBridgeCapabilitiesView from '$/views/CoinBridgeCapabilitiesView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmCoinInstance}
	bind:open
	entitySelector={selector}
	href={
		href ?? (
			selector.type === CoinInstanceType.NativeCurrency ?
				resolve(
					'/(assets)/(coinInstances)/coin-instance/[chainId]/[coinInstanceSlug]',
					{
						chainId: String(evmChainIdFromCaip2(`${selector.$network.caip2.namespace}:${selector.$network.caip2.reference}`)),
						coinInstanceSlug: 'native',
					},
				)
			:
				resolve(
					'/(assets)/(coinInstances)/coin-instance/[chainId]/[coinInstanceSlug]',
					{
						chainId: String(evmChainIdFromCaip2(`${selector.$network.caip2.namespace}:${selector.$network.caip2.reference}`)),
						coinInstanceSlug: selector.$contract.address,
					},
				)
		)
	}
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={coinInstance}
		>
			{#snippet children(coinInstance)}
				{#if coinInstance.fields.$icon?.[EntityMetaKey.Selector].url !== undefined}
					<IconComponent
						src={coinInstance.fields.$icon[EntityMetaKey.Selector].url}
						alt={coinInstance.fields.symbol ?? coinInstance.fields.name ?? ''}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={coinInstance}
		>
			{#snippet children(coinInstance)}
				<span>
					{coinInstance.fields.coinId}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={coinInstance}
			placeholderText="Loading…"
		>
			{#snippet children(coinInstance)}
				{coinInstance.fields.symbol ?? coinInstance.fields.name ?? (
					selector.type === CoinInstanceType.NativeCurrency ?
						`Native (${evmChainIdFromCaip2(`${selector.$network.caip2.namespace}:${selector.$network.caip2.reference}`)})`
					:
						`ERC-20 (${evmChainIdFromCaip2(`${selector.$network.caip2.namespace}:${selector.$network.caip2.reference}`)})`
				)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Per-chain deployment of a logical coin: native asset or bytecode-bound token with resolver-backed fields—when upstream data allows, the row exposes an honest CAIP-19 asset id for cross-wallet routing.
		</p>
		<p>
			Spot markets where this deployment is base or quote leg are not indexed yet; bridge capabilities use LiFi when configured.
		</p>
	{/snippet}

	{#snippet Content({})}
		<ResourceBoundary
			resource={coinInstance}
			placeholderText="Loading coin instance…"
		>
			{#snippet children(coinInstance)}
				<dl data-column-item="center">
					<div>
						<dt>Chain</dt>
						<dd>{String(evmChainIdFromCaip2(`${selector.$network.caip2.namespace}:${selector.$network.caip2.reference}`))}</dd>
					</div>
					<div>
						<dt>Kind</dt>
						<dd>
							{#if selector.type === CoinInstanceType.NativeCurrency}
								Native
							{:else}
								<EvmContractView
									selector={selector.$contract}
									layout={EntityLayout.Value}
									open={true}
									showTypeAnnotation={false}
								/>
							{/if}
						</dd>
					</div>
					{#if (
						open
						&& coinInstance.fields.name !== undefined
					)}
						<div>
							<dt>Name</dt>
							<dd>{coinInstance.fields.name}</dd>
						</div>
					{/if}

					{#if (
						open
						&& coinInstance.fields.symbol !== undefined
					)}
						<div>
							<dt>Symbol</dt>
							<dd>{coinInstance.fields.symbol}</dd>
						</div>
					{/if}

					{#if (
						open
						&& coinInstance.fields.decimals !== undefined
					)}
						<div>
							<dt>Decimals</dt>
							<dd>{String(coinInstance.fields.decimals)}</dd>
						</div>
					{/if}

					{#if (
						open
						&& coinInstance.fields.caip19 !== undefined
					)}
						<div>
							<dt>CAIP-19</dt>
							<dd>{coinInstance.fields.caip19}</dd>
						</div>
					{/if}

					{#if (
						open
						&& coinInstance.fields.representation !== undefined
					)}
						<div>
							<dt>Representation</dt>
							<dd>
								{coinInstanceRepresentationByRepresentation[coinInstance.fields.representation].label}
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& coinInstance.fields.$canonicalInstance
					)}
						<div>
							<dt>Canonical deployment</dt>
							<dd>
								<EvmCoinInstanceView
									selector={coinInstance.fields.$canonicalInstance[EntityMetaKey.Selector]}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<ResourceBoundary
			resource={coinInstance}
			placeholderText="Loading bridge capabilities…"
		>
			{#snippet children(coinInstance)}
				<CollapsibleTabs
					id={`${coinInstanceKey}:carousel-bridging`}
					sectionIdPrefix={coinInstanceKey}
					sections={[
						{ id: 'bridge-outbound', label: 'Outbound' },
						{ id: 'bridge-inbound', label: 'Inbound' },
					]}
					data-card
				>
					{#snippet Summary({ open: _isOpen })}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>
								Bridging
							</HeadingComponent>
						</header>
					{/snippet}

					{#snippet SectionBridgeOutbound({ id, label })}
						{#if (coinInstance.fields.$$outboundBridgeCapabilities?.values ?? []).length}
							<CoinBridgeCapabilitiesView
								CollapsibleProps={{ canToggle: false }}
								href={resolve('/bridge')}
								entityFieldReference={{
									entityType: EntityType.EvmCoinInstance,
									selector,
									fieldName: '$$outboundBridgeCapabilities',
								}}
								{id}
								title="Outbound"
							/>
						{/if}
					{/snippet}

					{#snippet SectionBridgeInbound({ id, label })}
						{#if (coinInstance.fields.$$inboundBridgeCapabilities?.values ?? []).length}
							<CoinBridgeCapabilitiesView
								CollapsibleProps={{ canToggle: false }}
								href={resolve('/bridge')}
								entityFieldReference={{
									entityType: EntityType.EvmCoinInstance,
									selector,
									fieldName: '$$inboundBridgeCapabilities',
								}}
								{id}
								title="Inbound"
							/>
						{/if}
					{/snippet}
				</CollapsibleTabs>
			{/snippet}
		</ResourceBoundary>

		{#if RouteContent}
			{@render RouteContent()}
		{/if}
	{/snippet}
</EntityView>
