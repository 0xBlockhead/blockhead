<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { ChainId } from '$/constants/ChainId.ts'
	import { networkByCaip2 } from '$/constants/Network.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/Source.ts'
	import { blo } from 'blo'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import { SvelteMap } from 'svelte/reactivity'


	// Context
	import { proxy } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selector,
		href = resolve('/account/[address]', { address: selector.address }),
		title = 'Account',
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selector: EntitySelector<typeof schema, EntityType.EvmAccount>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Functions
	const balanceChainIds = [
		ChainId.Ethereum,
		ChainId.Optimism,
		ChainId.BNB,
		ChainId.Polygon,
		ChainId.Base,
		ChainId.Arbitrum,
		ChainId.Avalanche,
	] as const

	const activityChainIds = [
		ChainId.Ethereum,
		ChainId.Optimism,
		ChainId.BNB,
		ChainId.Gnosis,
		ChainId.Polygon,
		ChainId.Base,
		ChainId.Arbitrum,
		ChainId.EthereumSepolia,
		ChainId.BaseSepolia,
	] as const

	const evmNetworkAccountSliceChainIds = (
		[...new Set([
			...balanceChainIds,
			...activityChainIds,
		])]
			.toSorted((a, b) => a - b)
	) satisfies readonly number[]

	const chainFacetLabel = (chainId: number) => (
		networkByCaip2[`eip155:${String(chainId)}`]?.name
		?? `Chain · ${String(chainId)}`
	)

	const evmNetworkAccountPortfolioSlices = $derived(
		open ?
			evmNetworkAccountSliceChainIds.map((chainId) => {
				const evmNetworkAccount = proxy(EntityType.EvmNetworkAccount, {
					$network: { caip2: { namespace: 'eip155' as const, reference: String(chainId) } },
					$actor: selector,
				}, {
					...(activityChainIds.some((activityChainId) => activityChainId === chainId) && {
						sources: [Source.Blockscout_Rest],
					}),
				})

				return {
					chainId,
					evmNetworkAccount,
					ownedCoins: evmNetworkAccount.field('$$ownedCoins', {
						sources: [Source.Allium_Rest],
					}),
					transactions: evmNetworkAccount.$$transactions,
					tokenTransfers: evmNetworkAccount.$$tokenTransfers,
					internalTransfers: evmNetworkAccount.$$internalTransfers,
					isContract: evmNetworkAccount.isContract,
					transactionCount: evmNetworkAccount.transactionCount,
					tokenTransferCount: evmNetworkAccount.tokenTransferCount,
					firstTransactionAt: evmNetworkAccount.firstTransactionAt,
					lastTransactionAt: evmNetworkAccount.lastTransactionAt,
					nftCount: evmNetworkAccount.nftCount,
				}
			})
		:
			[],
	)

	const idKey = $derived(stringify(selector))

	const actor = $derived(proxy(EntityType.EvmAccount, selector, {
		sources: [
			Source.Voltaire_JsonRpc,
			Source.TheGraph_Graphql,
		],
	}))
	const primaryName = $derived(actor.$primaryName({
		sources: [Source.Voltaire_JsonRpc],
	}))
	const icon = $derived(actor.$icon({
		sources: [Source.Voltaire_JsonRpc],
	}))
	const ensNamesOwned = $derived(actor.$$ensNamesOwned({
		sources: [Source.TheGraph_Graphql],
	}))

	// (Derived)
	const firstContractChainId = $derived.by(() => {
		for (let index = 0; index < evmNetworkAccountSliceChainIds.length; index += 1) {
			const chainId = evmNetworkAccountSliceChainIds[index]
			if (evmNetworkAccountPortfolioSlices[index]?.isContract.current === true)
				return chainId
		}
		return undefined
	})

	const flattenedCoinItems = $derived.by(() => {
		const merged = []

		for (let index = 0; index < evmNetworkAccountPortfolioSlices.length; index += 1) {
			const slice = evmNetworkAccountPortfolioSlices[index]
			const chainFacetId = evmNetworkAccountSliceChainIds[index]
			if (
				slice.ownedCoins.ready !== true
				|| !balanceChainIds.some((balanceChainId) => balanceChainId === chainFacetId)
			) continue
			for (const value of slice.ownedCoins.current?.entities ?? []) merged.push({
				value,
				symbol: value.symbol,
			})
		}

		return merged
	})

	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import BalancesView from '$/views/BalancesView.svelte'
	import EvmNetworkActorCoinBalanceView from '$/views/EvmNetworkActorCoinBalanceView.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import EvmTokenTransfersView from '$/views/EvmTokenTransfersView.svelte'
	import EvmInternalTransfersView from '$/views/EvmInternalTransfersView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmAccount}
	entitySelector={selector}
	href={href}
	{title}
	{layout}
	bind:open
	{collapsible}
	{...EntityViewProps}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={actor}
		>
			{#snippet Pending()}
				<IconComponent
					alt=""
					shape={IconShape.Square}
					src={blo(selector.address)}
				/>
			{/snippet}

			{#snippet children(actor)}
				{@const avatarUrl = actor.$icon?.entitySelector.url}
				<IconComponent
					alt=""
					shape={avatarUrl ? IconShape.Circle : IconShape.Square}
					src={avatarUrl ?? blo(selector.address)}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={actor}
		>
			{#snippet Pending()}
				<TruncatedValue
					format={TruncatedValueFormat.Visual}
					value={selector.address}
				/>
			{/snippet}

			{#snippet children(actor)}
				{#if actor.$primaryName?.entitySelector.name}
					{actor.$primaryName?.entitySelector.name}
				{:else}
					<TruncatedValue
						format={TruncatedValueFormat.Visual}
						value={selector.address}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			An EVM execution address: externally owned account or contract. Nothing here implies a dedicated wallet vs protocol-only role.
		</p>
		<p>
			Primary label and owned ENS names load from configured resolvers when available. Token balances aggregate Allium-covered networks; explorers power per-chain transaction timelines when REST v2 is available on the host catalog.
		</p>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<dl data-column-item="center">
			{#if (
				contentOpen
				&& flattenedCoinItems.length
			)}
				<div>
					<dt>Indexed balances</dt>
					<dd>{String(flattenedCoinItems.length)} token row{flattenedCoinItems.length === 1 ? '' : 's'}</dd>
				</div>
			{/if}

			{#if (
				contentOpen
				&& firstContractChainId != null
			)}
				<div>
					<dt>Contract</dt>
					<dd>
						<EvmContractView
							selector={{
								$network: { caip2: { namespace: 'eip155' as const, reference: String(firstContractChainId) } },
								address: selector.address,
							}}
							layout={EntityLayout.Value}
							open={true}
							showTypeAnnotation={false}
						/>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open,
	})}
		<CollapsibleTabs
			id={`${idKey}:carousel-identity`}
			sectionIdPrefix={idKey}
			sections={[
				{ id: 'actor-ens', label: 'Labels' },
			]}
			data-card
			class="actor-view-collapsible-identity"
		>
			{#snippet Summary({ open: _summaryOpen })}
				<header
					data-row-item="flexible"
					data-row="wrap gap-4"
				>
					<HeadingComponent>Identity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionActorEns({ id, label })}
				<ResourceBoundary
					placeholderText="Loading account…"
					resource={ensNamesOwned}
				>
					{#snippet children(ensNamesOwned)}
						{#if ensNamesOwned.entities.length}
							<ul data-evmAccounts="unstyled">
								{#each ensNamesOwned.entities as nameRef (`${nameRef.entitySelector.name}`)}
									<li>
										<a
											data-link
											href={resolve('/(explore)/(ens)/ens/name/[ensName]', {
												ensName: nameRef.entitySelector.name,
											})}
										>{nameRef.entitySelector.name}</a>
									</li>
								{/each}
							</ul>
						{:else}
							<div data-row="wrap align-center gap-2">
								<p data-text="muted">
									No ENS names.
								</p>
								<Tooltip
									content="Names owned by this address appear when subgraphs expose them from TheGraph transport."
									contentProps={{ side: 'top' }}
								>
									<abbr
										class="entity-heading-tip"
										aria-label="ENS names"
									>ⓘ</abbr>
								</Tooltip>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</CollapsibleTabs>

		<CollapsibleTabs
			id={`${idKey}:carousel-balances`}
			sectionIdPrefix={idKey}
			sections={[
				{ id: 'balances', label: 'Balances' },
			]}
			data-card
			class="actor-view-collapsible-balances"
		>
			{#snippet Summary({ open: _summaryOpen })}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Balances</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionBalances({ id, label })}
				<section id={`${idKey}:balances-by-asset`}>
						<EntitiesList
							collapsible={false}
							entityType={EntityType.EvmNetworkActorCoinBalance}
							title="By deployment (all indexed networks)"
							id={`${idKey}:balances-flat-evmAccounts`}
							getKey={(line) => stringify(line.value.entitySelector)}
							getSortValue={(line) => stringify(line.value.entitySelector)}
							items={flattenedCoinItems}
							UnorderedListProps={{
								orientation: ListOrientation.Column,
							}}
						>
							{#snippet Empty()}
								<p data-text="muted">
									No balances for this catalog yet.
								</p>
								{/snippet}
								{#snippet Item(props)}
									{#if props.item}
										<EvmNetworkActorCoinBalanceView
											selector={props.item.value.entitySelector}
											layout={EntityLayout.Summary}
										/>
									{/if}
							{/snippet}
						</EntitiesList>
					</section>

					{#each (() => {
						const groups = new SvelteMap<string, typeof flattenedCoinItems>()
						for (const line of flattenedCoinItems) {
							const row = line.value
							const assetKey = (
									line.symbol.current != null && line.symbol.current !== '' ?
										line.symbol.current
								:
										stringify(row.entitySelector)
							)
							const bucket = groups.get(assetKey)
							if (bucket != null) bucket.push(line)
							else groups.set(assetKey, [line])
						}
						return (
							[...groups.entries()]
								.toSorted(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
						)
					})() as coinGroup, coinGroupIndex (`coin-${String(coinGroupIndex)}`)}
						{#if coinGroup[1].length}
							<section
								data-scroll-marker-label={`${coinGroup[0]} balances`}
								id={`${idKey}:balances-coin-${String(coinGroupIndex)}`}
							>
								<EntitiesList
									collapsible={false}
									entityType={EntityType.EvmNetworkActorCoinBalance}
									title={`${coinGroup[0]} · by network`}
									id={`${idKey}:balances-coin-evmAccounts-${String(coinGroupIndex)}`}
									getKey={(line) => stringify(line.value.entitySelector)}
									getSortValue={(line) => stringify(line.value.entitySelector)}
									items={coinGroup[1]}
									UnorderedListProps={{
										orientation: ListOrientation.Column,
									}}
								>
									{#snippet Empty()}
										<p data-text="muted">
											No evmAccounts for this symbol.
										</p>
									{/snippet}
									{#snippet Item(props)}
										{#if props.item}
											<EvmNetworkActorCoinBalanceView
												selector={props.item.value.entitySelector}
												layout={EntityLayout.Summary}
											/>
										{/if}
									{/snippet}
								</EntitiesList>
							</section>
						{/if}
					{/each}

					{#each balanceChainIds as balancesChainId (balancesChainId)}
						<section
							data-scroll-marker-label={`${chainFacetLabel(balancesChainId)} balances`}
							id={`${idKey}:balances-net-${balancesChainId}`}
						>
								<BalancesView
									CollapsibleProps={{ canToggle: false }}
									href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(accounts)/account/[address]', {
										caip2: `eip155:${balancesChainId}`,
										address: selector.address,
									})}
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.EvmNetworkAccount,
									selector: {
										$network: { caip2: { namespace: 'eip155' as const, reference: String(balancesChainId) } },
										$actor: selector,
									},
									fieldName: '$$ownedCoins',
								}}
								id={`${idKey}:balances-per-net-${balancesChainId}`}
								title={chainFacetLabel(balancesChainId)}
							/>
						</section>
					{/each}
				{/snippet}
			</CollapsibleTabs>

			<CollapsibleTabs
				id={`${idKey}:carousel-activity`}
				sectionIdPrefix={idKey}
				sections={[
					{ id: 'activity', label: 'Activity' },
				]}
				data-card
				class="actor-view-collapsible-activity"
			>
			{#snippet Summary({ open: _summaryOpen })}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionActivity({ id, label })}
				{#each activityChainIds as facetChainId (facetChainId)}
					<section
						data-scroll-marker-label={`${chainFacetLabel(facetChainId)} activity`}
						id={`${idKey}:activity-net-${facetChainId}`}
					>
						<EvmNetworkAccountView
							selector={{
								$network: { caip2: { namespace: 'eip155' as const, reference: String(facetChainId) } },
								$actor: selector,
							}}
							layout={EntityLayout.Title}

							open={false}
							/>
						<EvmTransactionsView
							CollapsibleProps={{ canToggle: false }}
							href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(accounts)/account/[address]', {
								caip2: `eip155:${facetChainId}`,
								address: selector.address,
							})}
							collapsible={false}
							resource={proxy(
								EntityType.EvmNetworkAccount,
								{
									$network: { caip2: { namespace: 'eip155' as const, reference: String(facetChainId) } },
									$actor: selector,
								}
							).field('$$transactions', {
								sources: [Source.Blockscout_Rest],
								limit: 32,
							})}
							id={`${idKey}:activity-tx-${facetChainId}`}
							title={`${chainFacetLabel(facetChainId)} · Transactions`}
						/>
						<section
							data-scroll-marker-label={`${chainFacetLabel(facetChainId)} · Token transfers`}
							id={`${idKey}:activity-net-${facetChainId}-transfers`}
						>
							<EvmTokenTransfersView
									CollapsibleProps={{ canToggle: false }}
									href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(accounts)/account/[address]', {
										caip2: `eip155:${facetChainId}`,
										address: selector.address,
									})}
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.EvmNetworkAccount,
									selector: {
										$network: { caip2: { namespace: 'eip155' as const, reference: String(facetChainId) } },
										$actor: selector,
									},
									fieldName: '$$tokenTransfers',
								}}
								id={`${idKey}:activity-token-transfers-${facetChainId}`}
								title={`${chainFacetLabel(facetChainId)} · Token transfers`}
							/>
						</section>

						<section
							data-scroll-marker-label={`${chainFacetLabel(facetChainId)} · Internal transactions`}
							id={`${idKey}:activity-net-${facetChainId}-internal`}
						>
							<EvmInternalTransfersView
									CollapsibleProps={{ canToggle: false }}
									href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(accounts)/account/[address]', {
										caip2: `eip155:${facetChainId}`,
										address: selector.address,
									})}
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.EvmNetworkAccount,
									selector: {
										$network: { caip2: { namespace: 'eip155' as const, reference: String(facetChainId) } },
										$actor: selector,
									},
									fieldName: '$$internalTransfers',
								}}
								id={`${idKey}:activity-internal-tx-${facetChainId}`}
								title={`${chainFacetLabel(facetChainId)} · Internal transactions`}
							/>
						</section>
					</section>
				{/each}
			{/snippet}
			</CollapsibleTabs>
	{/snippet}
</EntityView>
