<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
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
			selection,
			href,
			open = $bindable(true),
			collapsible = true,
			...EntityViewProps
	}: WithRest<
		{
				RouteContent?: Snippet
			selection: EntityProxyResource<typeof schema, EntityType.EvmCoinInstance>
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
	import { select } from '$/routes/+layout.svelte'
	const coinInstance = $derived(selection( {
		sources: [
			Source.Coingecko_Rest,
			Source.Constants_Internal,
			Source.Lifi_Rest,
		],
	}))
	const coinId = $derived(coinInstance.coinId)
	const icon = $derived(coinInstance.$icon)
	const name = $derived(coinInstance.name)
	const symbol = $derived(coinInstance.symbol)
	const contract = $derived(coinInstance.$contract)
	const decimals = $derived(coinInstance.decimals)
	const caip19 = $derived(coinInstance.caip19)
	const representation = $derived(coinInstance.representation)
	const canonicalInstance = $derived(coinInstance.$canonicalInstance({
		sources: [Source.Coingecko_Rest],
	}))
	const outboundBridgeCapabilities = $derived(coinInstance.$$outboundBridgeCapabilities({
		sources: [Source.Lifi_Rest],
	}))
	const inboundBridgeCapabilities = $derived(coinInstance.$$inboundBridgeCapabilities({
		sources: [Source.Lifi_Rest],
	}))

	// (Derived)
	const coinInstanceKey = $derived(
		stringify(selection.entitySelector),
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
	entitySelector={selection.entitySelector}
	href={
		href ?? (
			selection.entitySelector.type === CoinInstanceType.NativeCurrency ?
				resolve(
						'/(assets)/(coinInstances)/coin-instance/[chainId=eip155ChainId]/[coinInstanceSlug]',
					{
						chainId: String(evmChainIdFromCaip2(`${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`)),
						coinInstanceSlug: 'native',
					},
				)
			:
				undefined
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
				{#if coinInstance.$icon?.entitySelector.url !== undefined}
					<IconComponent
						src={coinInstance.$icon.entitySelector.url}
						alt={coinInstance.symbol ?? coinInstance.name ?? ''}
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
					{coinInstance.coinId}
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
				{coinInstance.symbol ?? coinInstance.name ?? (
					selection.entitySelector.type === CoinInstanceType.NativeCurrency ?
						`Native (${evmChainIdFromCaip2(`${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`)})`
					:
						`Token (${evmChainIdFromCaip2(`${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`)})`
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
						<dd>{String(evmChainIdFromCaip2(`${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`))}</dd>
					</div>
					<div>
						<dt>Kind</dt>
						<dd>
							{#if selection.entitySelector.type === CoinInstanceType.NativeCurrency}
								Native
							{:else}
								{#if coinInstance.$contract}
									<EvmContractView
										selection={select(EntityType.EvmContract, coinInstance.$contract.entitySelector)}
										layout={EntityLayout.Value}
										open={true}
										showTypeAnnotation={false}
									/>
								{:else}
									Token contract unresolved
								{/if}
							{/if}
						</dd>
					</div>
					{#if (
						open
						&& coinInstance.name !== undefined
					)}
						<div>
							<dt>Name</dt>
							<dd>{coinInstance.name}</dd>
						</div>
					{/if}

					{#if (
						open
						&& coinInstance.symbol !== undefined
					)}
						<div>
							<dt>Symbol</dt>
							<dd>{coinInstance.symbol}</dd>
						</div>
					{/if}

					{#if (
						open
						&& coinInstance.decimals !== undefined
					)}
						<div>
							<dt>Decimals</dt>
							<dd>{String(coinInstance.decimals)}</dd>
						</div>
					{/if}

					{#if (
						open
						&& coinInstance.caip19 !== undefined
					)}
						<div>
							<dt>CAIP-19</dt>
							<dd>{coinInstance.caip19}</dd>
						</div>
					{/if}

					{#if (
						open
						&& coinInstance.representation !== undefined
					)}
						<div>
							<dt>Representation</dt>
							<dd>
								{coinInstanceRepresentationByRepresentation[coinInstance.representation].label}
							</dd>
						</div>
					{/if}

					{#if (
						open
						&& coinInstance.$canonicalInstance
					)}
						<div>
							<dt>Canonical deployment</dt>
							<dd>
								<EvmCoinInstanceView
									selection={select(EntityType.EvmCoinInstance, coinInstance.$canonicalInstance.entitySelector)}
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
						<CoinBridgeCapabilitiesView
							CollapsibleProps={{ canToggle: false }}
							href={resolve('/bridge')}
							selection={outboundBridgeCapabilities}
							{id}
							title="Outbound"
						/>
					{/snippet}

					{#snippet SectionBridgeInbound({ id, label })}
						<CoinBridgeCapabilitiesView
							CollapsibleProps={{ canToggle: false }}
							href={resolve('/bridge')}
							selection={inboundBridgeCapabilities}
							{id}
							title="Inbound"
						/>
					{/snippet}
				</CollapsibleTabs>
			{/snippet}
		</ResourceBoundary>

		{#if RouteContent}
			{@render RouteContent()}
		{/if}
	{/snippet}
</EntityView>
