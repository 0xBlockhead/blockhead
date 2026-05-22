<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'

	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { CoinInstanceType } from '$/schema/CoinInstance.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.CoinInstance>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const coinInstanceKey = $derived(
		stringify(entityId),
	)


	const nativeOrErcTitle = (
		entityId.type === CoinInstanceType.NativeCurrency ?
			(
				`Native (${entityId.$network.chainId})`
			)
		:
			(
				`ERC-20 (${entityId.$network.chainId})`
			)
	)


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
					$canonicalInstance: {},
					$$marketsWithInstanceAsBase: {},
					$$marketsWithInstanceAsQuote: {},
					$$outboundBridgeCapabilities: {},
					$$inboundBridgeCapabilities: {},
				}
				:
				{}),
		},
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
	import MarketsView from '$/views/MarketsView.svelte'
</script>


<EntityView
	entityType={EntityType.CoinInstance}
	bind:open
	{entityId}
	{href}
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={coinInstance}
			placeholderText=""
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
				{coinInstance.symbol ?? coinInstance.name ?? nativeOrErcTitle}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={coinInstance}
			placeholderText=""
		>
			{#snippet children(coinInstance)}
				<span>
					{coinInstance.coinId}
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Per-chain <strong>deployment</strong>
			of a logical coin: native asset or bytecode-bound token with resolver-backed fields—when upstream data allows, the row exposes an honest <strong>CAIP-19</strong>
			asset id for cross-wallet routing and quote attribution.
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
									href={resolve(
										'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
										{
											networkId: String(entityId.$contract.$network.chainId),
											address: entityId.$contract.address,
										},
									)}
									layout={EntityLayout.Title}
									open={false}
									showTypeAnnotation={false}
								/>
							{/if}
						</dd>
					</div>
					{#if open}
						{#if coinInstance.name !== undefined}
							<div>
								<dt>Name</dt>
								<dd>{coinInstance.name}</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if coinInstance.symbol !== undefined}
							<div>
								<dt>Symbol</dt>
								<dd>{coinInstance.symbol}</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if coinInstance.decimals !== undefined}
							<div>
								<dt>Decimals</dt>
								<dd>{String(coinInstance.decimals)}</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if coinInstance.caip19 !== undefined}
							<div>
								<dt>CAIP-19</dt>
								<dd>{coinInstance.caip19}</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if coinInstance.representation !== undefined}
							<div>
								<dt>Representation</dt>
								<dd>{coinInstance.representation}</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if coinInstance.$canonicalInstance}
							<div>
								<dt>Canonical deployment</dt>
								<dd>
									<CoinInstanceView
										entityId={coinInstance.$canonicalInstance[EntityMetaKey.Id]}
										href={resolve(
											'/(assets)/(coinInstances)/coin-instance/[chainId]/[coinInstanceSlug]',
											{
												chainId: String(
													coinInstance.$canonicalInstance[EntityMetaKey.Id].$network.chainId,
												),
												coinInstanceSlug: (
													coinInstance.$canonicalInstance[EntityMetaKey.Id].type
														=== CoinInstanceType.NativeCurrency ?
														'native'
													:
														coinInstance.$canonicalInstance[EntityMetaKey.Id].$contract.address
												),
											},
										)}
										layout={EntityLayout.Title}
										open={false}
										showTypeAnnotation={false}
									/>
								</dd>
							</div>
						{/if}
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

				{#snippet Markers(_context)}
					<ResourceBoundary resource={coinInstance}>
						{#snippet children(coinInstance)}
							{#if (coinInstance.$$outboundBridgeCapabilities ?? []).length}
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

				{#snippet body(_childrenContext)}
					<ResourceBoundary resource={coinInstance}>
						{#snippet children(coinInstance)}
							{#if (coinInstance.$$outboundBridgeCapabilities ?? []).length}
								<section
									data-scroll-marker-label="Outbound"
									id={`${coinInstanceKey}:bridge-outbound`}
								>
									<CoinBridgeCapabilitiesView
										collapsible={false}
										entityFieldReference={{
											entityType: EntityType.CoinInstance,
											entityId,
											fieldName: '$$outboundBridgeCapabilities',
										}}
										{href}
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
										collapsible={false}
										entityFieldReference={{
											entityType: EntityType.CoinInstance,
											entityId,
											fieldName: '$$inboundBridgeCapabilities',
										}}
										{href}
										title="Inbound"
									/>
								</section>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</CollapsibleTabs>

			<CollapsibleTabs
				id={`${coinInstanceKey}:carousel-markets`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>
							Markets
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers(_context)}
					<ResourceBoundary resource={coinInstance}>
						{#snippet children(coinInstance)}
							{#if (coinInstance.$$marketsWithInstanceAsBase ?? []).length}
								<a
									data-scroll-marker-label="Base"
									href={`#${coinInstanceKey}:markets-base`}
								>Base</a>
							{/if}

							{#if (coinInstance.$$marketsWithInstanceAsQuote ?? []).length}
								<a
									data-scroll-marker-label="Quote"
									href={`#${coinInstanceKey}:markets-quote`}
								>Quote</a>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet body(_childrenContext)}
					<ResourceBoundary resource={coinInstance}>
						{#snippet children(coinInstance)}
							{#if (coinInstance.$$marketsWithInstanceAsBase ?? []).length}
								<section>
									<MarketsView
										collapsible={false}
										entityFieldReference={{
											entityType: EntityType.CoinInstance,
											entityId,
											fieldName: '$$marketsWithInstanceAsBase',
										}}
										{href}
										id={`${coinInstanceKey}:markets-base`}
										title="Base"
									/>
								</section>
							{/if}

							{#if (coinInstance.$$marketsWithInstanceAsQuote ?? []).length}
								<section>
									<MarketsView
										collapsible={false}
										entityFieldReference={{
											entityType: EntityType.CoinInstance,
											entityId,
											fieldName: '$$marketsWithInstanceAsQuote',
										}}
										{href}
										id={`${coinInstanceKey}:markets-quote`}
										title="Quote"
									/>
								</section>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</CollapsibleTabs>

			{#if children}
				{@render children()}
			{/if}
		</div>
	{/snippet}
</EntityView>


<style>
	.entity-view-detail-carousels :global(.collapsible-tabs-scroll[data-scroll-container]) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 40ch;
			}
		}
	}
</style>
