<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { entityResolversByEntityType } from '$/resolvers/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/(assets)/(vaults)/vault/[chainId]/[vaultId]',
			{
				chainId: String(entityId.chainId),
				vaultId: entityId.vaultId,
			},
		),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.Vault>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const vault = useEntity(
		EntityType.Vault,
		entityId,
		{
			$: (
				entityResolversByEntityType[EntityType.Vault]?.map((resolver) => resolver.source)
				?? [Source.Dexscreener_OpenApi]
			),
			$token0: {},
			$token1: {},
			token0Symbol: {},
			token1Symbol: {},
			volumeUSD: {},
			totalValueLockedUSD: {},
			marketCapUsd: {},
			fdvUsd: {},
			pairCreatedAtMs: {},
			dexscreenerLabels: {},
			dexId: {},
			dexscreenerPairUrl: {},
			baseTokenPriceUsd: {},
			baseTokenPriceQuote: {},
			priceChangePercent24h: {},
			transactionBuys24h: {},
			transactionSells24h: {},
		},
	)


	// Components
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.Vault}
	{entityId}
	href={href}
	{open}
	{...EntityViewProps}
>
	{#snippet Value()}
		<TruncatedValue
			value={entityId.id}
			format={TruncatedValueFormat.Visual}
		/>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={vault}
			placeholderText="Loading vault…"
		>
			{#snippet children(loadedVault)}
				{loadedVault.token0Symbol} / {loadedVault.token1Symbol}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Heading()}
		<span data-text="muted">
			{@render Value()}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Dexscreener-backed concentrated-liquidity pair row: token addresses, symbols, volume, and liquidity (USD)—not an ERC-4626 yield loadedVault.
		</p>
		<p>
			Market stats come from the Dexscreener pair API only; on-chain curve state (fee tier, tick, in-range liquidity) is not available from this source.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={vault}
			placeholderText="Loading vault…"
		>
			{#snippet children(loadedVault)}
				<dl data-column-item="center">
					{#if open}
						<div>
							<dt>Note</dt>
							<dd>
								<div data-row="wrap align-center gap-2">
									<span data-text="muted">Market stats from Dexscreener pair API.</span>
									<Tooltip contentProps={{ side: 'top' }}>
										{#snippet Content()}
											<p>This entity label “Vault” means a DEX concentrated-liquidity pool in Dexscreener’s pair catalog—not ERC-4626 shares, IPFS storage, or social vaults.</p>
										{/snippet}
										<abbr
											class="entity-heading-tip"
											aria-label="Vault vs yield vault"
										>ⓘ</abbr>
									</Tooltip>
								</div>
							</dd>
						</div>
					{/if}

					<div>
						<dt>Token 0</dt>
						<dd>
							<EvmContractView
								entityId={loadedVault.$token0}
								layout={EntityLayout.SummaryDetails}
								open={false}
								showTypeAnnotation={false}
							/>
						</dd>
					</div>

					<div>
						<dt>Token 1</dt>
						<dd>
							<EvmContractView
								entityId={loadedVault.$token1}
								layout={EntityLayout.SummaryDetails}
								open={false}
								showTypeAnnotation={false}
							/>
						</dd>
					</div>

					{#if (
						open
						&& vault.volumeUSD !== undefined
					)}
						<div>
							<dt>Volume USD (24h)</dt>
							<dd>{String(vault.volumeUSD)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& vault.totalValueLockedUSD !== undefined
					)}
						<div>
							<dt>Liquidity (USD)</dt>
							<dd>{String(vault.totalValueLockedUSD)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& vault.marketCapUsd !== undefined
					)}
						<div>
							<dt>Market cap (USD)</dt>
							<dd>{String(vault.marketCapUsd)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& vault.fdvUsd !== undefined
					)}
						<div>
							<dt>FDV (USD)</dt>
							<dd>{String(vault.fdvUsd)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& vault.pairCreatedAtMs != null
					)}
						<div>
							<dt>Pair created</dt>
							<dd>
								<Timestamp
									timestamp={loadedVault.pairCreatedAtMs}
								/>
							</dd>
						</div>
					{/if}
					{#if (
						open
						&& (vault.dexscreenerLabels?.length ?? 0) > 0
					)}
						<div>
							<dt>Labels</dt>
							<dd>{loadedVault.dexscreenerLabels?.join(', ')}</dd>
						</div>
					{/if}
					{#if (
						open
						&& vault.dexId !== undefined
					)}
						<div>
							<dt>DEX</dt>
							<dd>{loadedVault.dexId}</dd>
						</div>
					{/if}
					{#if (
						open
						&& vault.dexscreenerPairUrl !== undefined
					)}
						<div>
							<dt>Dexscreener</dt>
							<dd>
								<a
									href={loadedVault.dexscreenerPairUrl}
									rel="noreferrer"
									target="_blank"
								>{loadedVault.dexscreenerPairUrl}</a>
							</dd>
						</div>
					{/if}
					{#if (
						open
						&& vault.baseTokenPriceUsd !== undefined
					)}
						<div>
							<dt>Base price (USD)</dt>
							<dd>{loadedVault.baseTokenPriceUsd}</dd>
						</div>
					{/if}
					{#if (
						open
						&& vault.baseTokenPriceQuote !== undefined
					)}
						<div>
							<dt>Base price (quote)</dt>
							<dd>{loadedVault.baseTokenPriceQuote}</dd>
						</div>
					{/if}
					{#if (
						open
						&& vault.priceChangePercent24h !== undefined
					)}
						<div>
							<dt>Price change (24h)</dt>
							<dd>{String(vault.priceChangePercent24h)}%</dd>
						</div>
					{/if}
					{#if (
						open
						&& vault.transactionBuys24h !== undefined
					)}
						<div>
							<dt>Buys (24h)</dt>
							<dd>{String(vault.transactionBuys24h)}</dd>
						</div>
					{/if}
					{#if (
						open
						&& vault.transactionSells24h !== undefined
					)}
						<div>
							<dt>Sells (24h)</dt>
							<dd>{String(vault.transactionSells24h)}</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({ open: _open })}
		<EntityDetails
			entityType={EntityType.Vault}
			{entityId}
		/>
	{/snippet}
</EntityView>
