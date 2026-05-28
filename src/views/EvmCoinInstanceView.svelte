<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
	import { schema } from '$/schema/index.ts'
	import { coinInstanceRepresentationByRepresentation } from '$/constants/Bridge.ts'
	import { Source } from '$/sources/$Source.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
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
			entityId: EntityId<typeof schema, EntityType.EvmCoinInstance>
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
		EntityType.EvmCoinInstance,
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
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmCoinInstance}
	bind:open
	{entityId}
	href={coinInstanceHref}
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={coinInstance}
		>
			{#snippet children(coinInstance)}
				{#if coinInstance.$icon?.[EntityMetaKey.Id].url !== undefined}
					<IconComponent
						src={coinInstance.$icon[EntityMetaKey.Id].url}
						alt={coinInstance.symbol ?? coinInstance.name ?? ''}
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
			{#snippet children(coinInstance)}
				{coinInstance.symbol ?? coinInstance.name ?? (
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
			{#snippet children(coinInstance)}
				<span>
					{coinInstance.coinId}
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
			{#snippet children(coinInstance)}
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
									entityId={coinInstance.$canonicalInstance[EntityMetaKey.Id]}
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
			entityType={EntityType.EvmCoinInstance}
			{entityId}
		/>
		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
			data-carousel-basis="40ch"
		>
			<CollapsibleTabs
				id={`${coinInstanceKey}:carousel-bridging`}
				sectionIdPrefix={coinInstanceKey}
				sections={[
					...((coinInstance.$$outboundBridgeCapabilities ?? []).length ? [{ id: 'bridge-outbound', label: 'Outbound' }] : []),
					...((coinInstance.$$inboundBridgeCapabilities ?? []).length ? [{ id: 'bridge-inbound', label: 'Inbound' }] : []),
				]}
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

				{#snippet SectionBridgeOutbound({ id, label })}
					{#if (coinInstance.$$outboundBridgeCapabilities ?? []).length}
						<CoinBridgeCapabilitiesView
							href={resolve('/bridge')}
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.EvmCoinInstance,
								entityId,
								fieldName: '$$outboundBridgeCapabilities',
							}}
							{id}
							title="Outbound"
						/>
					{/if}
				{/snippet}

				{#snippet SectionBridgeInbound({ id, label })}
					{#if (coinInstance.$$inboundBridgeCapabilities ?? []).length}
						<CoinBridgeCapabilitiesView
							href={resolve('/bridge')}
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.EvmCoinInstance,
								entityId,
								fieldName: '$$inboundBridgeCapabilities',
							}}
							{id}
							title="Inbound"
						/>
					{/if}
				{/snippet}
			</CollapsibleTabs>

			{#if RouteContent}
				{@render RouteContent()}
			{/if}
		</div>
	{/snippet}
</EntityView>
