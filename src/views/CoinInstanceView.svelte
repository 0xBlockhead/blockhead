<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { CoinInstanceType } from '$/schema/CoinInstance.ts'
	import { schema } from '$/schema/index.ts'
	import { coinInstanceRepresentations } from '$/constants/Bridge.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		RouteContent,
		entityId,
		href,
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			RouteContent?: Snippet
			entityId: EntityId<typeof schema, EntityType.CoinInstance>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
			| 'title'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const coinInstance = useEntity(
		EntityType.CoinInstance,
		entityId,
		{
			$: [
				Source.Coingecko_Rest,
				Source.Constants_Internal,
				Source.Lifi_Rest,
			],
			coinId: {},
			$icon: {},
			name: {},
			symbol: {},
			...(open ?
				{
					decimals: {},
					caip19: {},
					representation: {},
					$canonicalInstance: {
						$: [Source.Coingecko_Rest],
					},
					$$outboundBridgeCapabilities: {
						$: [Source.Lifi_Rest],
					},
					$$inboundBridgeCapabilities: {
						$: [Source.Lifi_Rest],
					},
				}
				:
				{}),
		},
	)


	// (Derived)
	const coinInstanceKey = $derived(
		stringify(entityId),
	)

	const coinInstanceHref = $derived(
		href ?? (
			entityId.type === CoinInstanceType.NativeCurrency ?
				resolve(
					'/(assets)/(coinInstances)/coin-instance/[chainId]/[coinInstanceSlug]',
					{
						chainId: String(entityId.$network.chainId),
						coinInstanceSlug: 'native',
					},
				)
			:
				resolve(
					'/(assets)/(coinInstances)/coin-instance/[chainId]/[coinInstanceSlug]',
					{
						chainId: String(entityId.$network.chainId),
						coinInstanceSlug: entityId.$contract.address,
					},
				)
		),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import CoinBridgeCapabilitiesView from '$/views/CoinBridgeCapabilitiesView.svelte'
	import CoinInstanceView from '$/views/CoinInstanceView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.CoinInstance}
	bind:open
	{entityId}
	href={coinInstanceHref}
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={coinInstance}
		>
			{#snippet children(loadedCoinInstance)}
				{#if loadedCoinInstance.$icon?.[EntityMetaKey.Id].url !== undefined}
					<IconComponent
						src={loadedCoinInstance.$icon[EntityMetaKey.Id].url}
						alt={loadedCoinInstance.symbol ?? loadedCoinInstance.name ?? ''}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={coinInstance}
			placeholderText="Loading…"
		>
			{#snippet children(loadedCoinInstance)}
				{loadedCoinInstance.symbol ?? loadedCoinInstance.name ?? (
					entityId.type === CoinInstanceType.NativeCurrency ?
						`Native (${entityId.$network.chainId})`
					:
						`ERC-20 (${entityId.$network.chainId})`
				)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={coinInstance}
		>
			{#snippet children(loadedCoinInstance)}
				<span>
					{loadedCoinInstance.coinId}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		{@render Heading()}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Per-chain deployment of a logical coin: native asset or bytecode-bound token with resolver-backed fields—when upstream data allows, the row exposes an honest CAIP-19 asset id for cross-wallet routing.
		</p>
		<p>
			Spot markets where this deployment is base or quote leg are not indexed yet; bridge capabilities use LiFi when configured.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={coinInstance}
			placeholderText="Loading coin instance…"
		>
			{#snippet children(loadedCoinInstance)}
				<dl data-column-item="center">
					<div>
						<dt>Chain</dt>
						<dd>{String(entityId.$network.chainId)}</dd>
					</div>
					<div>
						<dt>Kind</dt>
						<dd>
							{#if entityId.type === CoinInstanceType.NativeCurrency}
								Native
							{:else}
								<EvmContractView
									entityId={entityId.$contract}
									layout={EntityLayout.SummaryDetails}
									open={true}
									showTypeAnnotation={false}
								/>
							{/if}
						</dd>
					</div>
					{#if (
						open
						&& coinInstance.name !== undefined
					)}
						<div>
							<dt>Name</dt>
							<dd>{loadedCoinInstance.name}</dd>
						</div>
					{/if}

					{#if (
						open
						&& coinInstance.symbol !== undefined
					)}
						<div>
							<dt>Symbol</dt>
							<dd>{loadedCoinInstance.symbol}</dd>
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
							<dd>{loadedCoinInstance.caip19}</dd>
						</div>
					{/if}

					{#if (
						open
						&& coinInstance.representation !== undefined
					)}
						<div>
							<dt>Representation</dt>
							<dd>
								{coinInstanceRepresentations[loadedCoinInstance.representation].label}
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
								<CoinInstanceView
									entityId={loadedCoinInstance.$canonicalInstance[EntityMetaKey.Id]}
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
		<EntityDetails
			entityType={EntityType.CoinInstance}
			{entityId}
		/>
		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
			data-carousel-basis="40ch"
		>
			<CollapsibleTabs
				id={`${coinInstanceKey}:carousel-bridging`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>
							Bridging
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					<ResourceBoundary resource={coinInstance}>
						{#snippet children(loadedCoinInstance)}
							{#if (loadedCoinInstance.$$outboundBridgeCapabilities ?? []).length}
								<a
									data-scroll-marker-label="Outbound"
									href={`#${coinInstanceKey}:bridge-outbound`}
								>Outbound</a>
							{/if}

							{#if (coinInstance.$$inboundBridgeCapabilities ?? []).length}
								<a
									data-scroll-marker-label="Inbound"
									href={`#${coinInstanceKey}:bridge-inbound`}
								>Inbound</a>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet body({ open: _bodyOpen })}
					<ResourceBoundary resource={coinInstance}>
						{#snippet children(loadedCoinInstance)}
							{#if (loadedCoinInstance.$$outboundBridgeCapabilities ?? []).length}
								<section
									data-scroll-marker-label="Outbound"
									id={`${coinInstanceKey}:bridge-outbound`}
								>
									<CoinBridgeCapabilitiesView
										href={resolve('/bridge')}
										collapsible={false}
										entityFieldReference={{
											entityType: EntityType.CoinInstance,
											entityId,
											fieldName: '$$outboundBridgeCapabilities',
										}}
										title="Outbound"
									/>
								</section>
							{/if}

							{#if (coinInstance.$$inboundBridgeCapabilities ?? []).length}
								<section
									data-scroll-marker-label="Inbound"
									id={`${coinInstanceKey}:bridge-inbound`}
								>
									<CoinBridgeCapabilitiesView
										href={resolve('/bridge')}
										collapsible={false}
										entityFieldReference={{
											entityType: EntityType.CoinInstance,
											entityId,
											fieldName: '$$inboundBridgeCapabilities',
										}}
										title="Inbound"
									/>
								</section>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</CollapsibleTabs>

			{#if RouteContent}
				{@render RouteContent()}
			{/if}
		</div>
	{/snippet}
</EntityView>


