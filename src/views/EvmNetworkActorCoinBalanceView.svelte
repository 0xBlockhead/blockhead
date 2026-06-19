<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// State
	let {
		selection,
		href,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EvmNetworkActorCoinBalance>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	import { select } from '$/routes/+layout.svelte'
	import { formatValue } from '$/lib/number.ts'

	const actorCoinDetailAnchorKey = $derived(stringify(selection.entitySelector))
	const actorCoin = $derived(selection( {
		sources: [Source.Allium_Rest],
	}))
	const symbol = $derived(actorCoin.symbol)
	const balance = $derived(actorCoin.balance)
	const coinInstance = $derived(actorCoin.$coinInstance)
	const decimals = $derived(actorCoin.decimals)


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
	entitySelector={selection.entitySelector}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={balance}
			placeholderText="Loading balance…"
		>
			{#snippet children(balance)}
				<ResourceBoundary
					resource={decimals}
					placeholderText="Loading balance decimals…"
				>
					{#snippet children(decimals)}
						<ResourceBoundary
							resource={symbol}
							placeholderText="Loading balance symbol…"
						>
							{#snippet children(symbol)}
								{#if balance !== undefined}
									{#if decimals === undefined || decimals <= 0}
										{formatValue(Number(balance))}
									{:else}
										{@const divisor = 10n ** BigInt(decimals)}
										{@const integerPart = balance / divisor}
										{@const fractionalPartString = String(balance % divisor).padStart(decimals, '0').replace(/0+$/, '')}
										{fractionalPartString ? `${formatValue(Number(integerPart))}.${fractionalPartString}` : formatValue(Number(integerPart))}
									{/if}
								{:else}
									—
								{/if}
								{symbol ?? ''}
							{/snippet}
						</ResourceBoundary>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<ResourceBoundary
			resource={balance}
			placeholderText="Loading holding…"
		>
			{#snippet children(balance)}
				<ResourceBoundary
					resource={decimals}
					placeholderText="Loading balance decimals…"
				>
					{#snippet children(decimals)}
						<ResourceBoundary
							resource={symbol}
							placeholderText="Loading balance symbol…"
						>
							{#snippet children(symbol)}
								{#if balance !== undefined}
									{#if decimals === undefined || decimals <= 0}
										{formatValue(Number(balance))}
									{:else}
										{@const divisor = 10n ** BigInt(decimals)}
										{@const integerPart = balance / divisor}
										{@const fractionalPartString = String(balance % divisor).padStart(decimals, '0').replace(/0+$/, '')}
										{fractionalPartString ? `${formatValue(Number(integerPart))}.${fractionalPartString}` : formatValue(Number(integerPart))}
									{/if}
								{:else}
									—
								{/if}
								{symbol ?? ''}
							{/snippet}
						</ResourceBoundary>
					{/snippet}
				</ResourceBoundary>
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
					<ResourceBoundary
						resource={coinInstance}
						placeholderText="Loading account…"
					>
						{#snippet children(coinInstance)}
							{#if coinInstance}
								<EvmNetworkAccountView
									selection={select(EntityType.EvmNetworkAccount, {
										$network: coinInstance.entitySelector.$network,
										$actor: selection.entitySelector.$actor,
									})}
									layout={EntityLayout.Title}

									open={false}
									/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
			<div>
				<dt>Asset</dt>
				<dd>
					<ResourceBoundary
						resource={coinInstance}
						placeholderText="Loading asset…"
					>
						{#snippet children(coinInstance)}
							{#if coinInstance?.entitySelector.type === CoinInstanceType.NativeCurrency}
								Native gas token (chain issuance)
							{:else}
								<ResourceBoundary
									resource={actorCoin.$coinInstance.$contract}
									placeholderText="Loading token contract…"
								>
									{#snippet children(coinInstanceContract)}
										{#if coinInstanceContract}
											<EvmContractView
												selection={select(EntityType.EvmContract, coinInstanceContract.entitySelector)}
												layout={EntityLayout.Value}

												showTypeAnnotation={false}
												open={false}
												/>
										{:else}
											—
										{/if}
									{/snippet}
								</ResourceBoundary>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			{#if contentOpen}
				<div>
					<dt>Balance</dt>
					<dd>
						<ResourceBoundary
							resource={balance}
							placeholderText="Loading balance…"
						>
							{#snippet children(balance)}
								{#if balance !== undefined}
									<ResourceBoundary
										resource={decimals}
										placeholderText="Loading balance decimals…"
									>
										{#snippet children(decimals)}
											<ResourceBoundary
												resource={symbol}
												placeholderText="Loading balance symbol…"
											>
												{#snippet children(symbol)}
													{#if decimals === undefined || decimals <= 0}
														{formatValue(Number(balance))}
													{:else}
														{@const divisor = 10n ** BigInt(decimals)}
														{@const integerPart = balance / divisor}
														{@const fractionalPartString = String(balance % divisor).padStart(decimals, '0').replace(/0+$/, '')}
														{fractionalPartString ? `${formatValue(Number(integerPart))}.${fractionalPartString}` : formatValue(Number(integerPart))}
													{/if}
													{symbol ?? ''}
												{/snippet}
											</ResourceBoundary>
										{/snippet}
									</ResourceBoundary>
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
							resource={actorCoin.usdValue}
							placeholderText="Loading balance…"
						>
							{#snippet children(usdValue)}
								{#if usdValue !== undefined}
									{String(usdValue)}
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
							resource={decimals}
							placeholderText="Loading balance…"
						>
							{#snippet children(decimals)}
								{#if decimals !== undefined}
									{String(decimals)}
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
