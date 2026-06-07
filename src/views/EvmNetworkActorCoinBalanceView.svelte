<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'

	const pathNativeCoin = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' as const


	// State
	let {
		entityId,
		href = resolve(
			'/~/(accounts)/accounts/(balances)/balance/[chainId]/[owner]/[coin]',
			{
				chainId: String(evmChainIdFromCaip2(`${entityId.$coinInstance.$network.caip2.namespace}:${entityId.$coinInstance.$network.caip2.reference}`)),
				owner: entityId.$actor.address,
				coin: (
					entityId.$coinInstance.type === CoinInstanceType.Erc20Token ?
						entityId.$coinInstance.$contract.address
					:
						pathNativeCoin
				),
			},
		),
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EvmNetworkActorCoinBalance>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()

	import { evmChainIdFromCaip2 } from '$/lib/caip.ts'
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { formatValue } from '$/lib/number.ts'

	const actorCoinDetailAnchorKey = stringify(entityId)

	const actorCoin = useEntity(
		EntityType.EvmNetworkActorCoinBalance,
		entityId,
		{
			$: [Source.Allium_Rest],
			symbol: {},
			balance: {},
			...(open ?
				{
					decimals: {},
					usdValue: {},
				}
			:
				{}),
		},
	)


	// (Derived)
	const formattedBalance = $derived.by(() => {
		const currentActorCoin = actorCoin.current

		if (currentActorCoin?.balance == null)
			return undefined

		if (currentActorCoin.decimals == null || currentActorCoin.decimals <= 0)
			return formatValue(Number(currentActorCoin.balance))

		const divisor = 10n ** BigInt(currentActorCoin.decimals)
		const integerPart = currentActorCoin.balance / divisor
		const fractionalPart = currentActorCoin.balance % divisor
		const fractionalPartString = String(fractionalPart).padStart(currentActorCoin.decimals, '0').replace(/0+$/, '')

		return (
			fractionalPartString ?
				`${formatValue(Number(integerPart))}.${fractionalPartString}`
			:
				formatValue(Number(integerPart))
		)
	})


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetworkActorCoinBalance}
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={actorCoin}
			placeholderText="Loading balance…"
		>
			{#snippet children(actorCoin)}
				{formattedBalance ?? '—'}
				{actorCoin.symbol ?? ''}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={actorCoin}
			placeholderText="Loading holding…"
		>
			{#snippet children(actorCoin)}
				{formattedBalance ?? '—'}
				{actorCoin.symbol ?? ''}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({
		open: contentOpen,
	})}
		<dl data-column-item="center">
			<div>
				<dt>Account</dt>
				<dd>
					<EvmNetworkAccountView
						entityId={{
							$network: entityId.$coinInstance.$network,
							$actor: entityId.$actor,
						}}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
			<div>
				<dt>Asset</dt>
				<dd>
					{#if entityId.$coinInstance.type === CoinInstanceType.NativeCurrency}
						Native gas token (chain issuance)
					{:else if entityId.$coinInstance.type === CoinInstanceType.Erc20Token}
						<EvmContractView
							entityId={entityId.$coinInstance.$contract}
							layout={EntityLayout.Value}
							open={false}
							showTypeAnnotation={false}
						/>
					{:else}
						—
					{/if}
				</dd>
			</div>

			{#if contentOpen}
				<div>
					<dt>Balance</dt>
					<dd>
						<ResourceBoundary
							resource={actorCoin}
							placeholderText="Loading balance…"
						>
							{#snippet children(actorCoin)}
								{#if actorCoin.balance !== undefined}
									{formattedBalance}
									{actorCoin.symbol ?? ''}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>USD value</dt>
					<dd>
						<ResourceBoundary
							resource={actorCoin}
							placeholderText="Loading balance…"
						>
							{#snippet children(actorCoin)}
								{#if actorCoin.usdValue !== undefined}
									{String(actorCoin.usdValue)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Decimals</dt>
					<dd>
						<ResourceBoundary
							resource={actorCoin}
							placeholderText="Loading balance…"
						>
							{#snippet children(actorCoin)}
								{#if actorCoin.decimals !== undefined}
									{String(actorCoin.decimals)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<CollapsibleTabs
			id={`${actorCoinDetailAnchorKey}:carousel-related`}
			sectionIdPrefix={actorCoinDetailAnchorKey}
			sections={[
				{ id: 'coin-overview', label: 'Overview' },
			]}
			data-card
		>
			{#snippet Summary({ open: _relatedSummaryOpen })}
				<header
					data-row-item="flexible"
					data-row="wrap gap-4"
				>
					<HeadingComponent>
						Holding detail
					</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionCoinOverview({ id, label })}
				<ResourceBoundary
					resource={actorCoin}
					placeholderText="Loading holding…"
				>
					{#snippet children(actorCoin)}
						{#if (
							actorCoin.symbol == null
							&& actorCoin.decimals == null
							&& actorCoin.balance == null
						)}
							<div data-row="wrap align-center gap-2">
								<p data-text="muted">
									No balance yet.
								</p>
								<Tooltip contentProps={{ side: 'top' }}>
									{#snippet Content()}
										<p>
											Symbol, decimals, and balance appear once this holding is resolved for the wallet on this network.
										</p>
									{/snippet}
									<abbr
										class="entity-heading-tip"
										aria-label="Token balance"
									>ⓘ</abbr>
								</Tooltip>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>

			{/snippet}
	</CollapsibleTabs>
	{/snippet}
</EntityView>
