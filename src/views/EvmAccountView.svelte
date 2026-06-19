<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
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
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// State
	let {
		selection,
		href = resolve('/account/[address=evmAddress]', { address: selection.entitySelector.address }),
		title = 'Account',
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.EvmAccount>
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
				const evmNetworkAccount = select(EntityType.EvmNetworkAccount, {
					$network: { caip2: { namespace: 'eip155' as const, reference: String(chainId) } },
					$actor: selection.entitySelector,
				}, {
					...(activityChainIds.some((activityChainId) => activityChainId === chainId) && {
						sources: [Source.Blockscout_Rest],
					}),
				})

				return {
					chainId,
					evmNetworkAccount,
					ownedCoins: evmNetworkAccount.$$ownedCoins({
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

	const idKey = $derived(stringify(selection.entitySelector))

	const actor = $derived(selection( {
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
	const firstContractChainId = $derived(undefined)

	const flattenedCoinItems: EntityProxyResource<typeof schema, EntityType.EvmNetworkActorCoinBalance>[] = $derived([])

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
	entitySelector={selection.entitySelector}
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
					src={blo(selection.entitySelector.address)}
				/>
			{/snippet}

			{#snippet children(actor)}
				{@const avatarUrl = actor.$icon?.entitySelector.url}
				<IconComponent
					alt=""
					shape={avatarUrl ? IconShape.Circle : IconShape.Square}
					src={avatarUrl ?? blo(selection.entitySelector.address)}
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
					value={selection.entitySelector.address}
				/>
			{/snippet}

			{#snippet children(actor)}
				{#if actor.$primaryName?.entitySelector.name}
					{actor.$primaryName?.entitySelector.name}
				{:else}
					<TruncatedValue
						format={TruncatedValueFormat.Visual}
						value={selection.entitySelector.address}
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
							selection={select(EntityType.EvmContract, {
								$network: { caip2: { namespace: 'eip155' as const, reference: String(firstContractChainId) } },
								address: selection.entitySelector.address,
							})}
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
											selection={select(EntityType.EvmNetworkActorCoinBalance, props.item.value.entitySelector)}
											layout={EntityLayout.Summary}
										/>
									{/if}
							{/snippet}
						</EntitiesList>
					</section>

					{#each balanceChainIds as balancesChainId (balancesChainId)}
						<section
							data-scroll-marker-label={`${chainFacetLabel(balancesChainId)} balances`}
							id={`${idKey}:balances-net-${balancesChainId}`}
						>
								<BalancesView
									CollapsibleProps={{ canToggle: false }}
									href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(accounts)/account/[address=evmAddress]', {
										caip2: `eip155:${balancesChainId}`,
										address: selection.entitySelector.address,
									})}
								collapsible={false}
								selection={select(
									EntityType.EvmNetworkAccount,
									{
										$network: { caip2: { namespace: 'eip155' as const, reference: String(balancesChainId) } },
										$actor: selection.entitySelector,
									}
								).$$ownedCoins}
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
							selection={select(EntityType.EvmNetworkAccount, {
								$network: { caip2: { namespace: 'eip155' as const, reference: String(facetChainId) } },
								$actor: selection.entitySelector,
							})}
							layout={EntityLayout.Title}

							open={false}
							/>
						<EvmTransactionsView
							CollapsibleProps={{ canToggle: false }}
							href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(accounts)/account/[address=evmAddress]', {
								caip2: `eip155:${facetChainId}`,
								address: selection.entitySelector.address,
							})}
							collapsible={false}
							selection={select(
								EntityType.EvmNetworkAccount,
								{
									$network: { caip2: { namespace: 'eip155' as const, reference: String(facetChainId) } },
									$actor: selection.entitySelector,
								}
								).$$transactions({
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
									href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(accounts)/account/[address=evmAddress]', {
										caip2: `eip155:${facetChainId}`,
										address: selection.entitySelector.address,
									})}
								collapsible={false}
								selection={select(
			EntityType.EvmNetworkAccount,
			{
										$network: { caip2: { namespace: 'eip155' as const, reference: String(facetChainId) } },
										$actor: selection.entitySelector,
									}
		).$$tokenTransfers}
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
									href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(accounts)/account/[address=evmAddress]', {
										caip2: `eip155:${facetChainId}`,
										address: selection.entitySelector.address,
									})}
								collapsible={false}
								selection={select(
			EntityType.EvmNetworkAccount,
			{
										$network: { caip2: { namespace: 'eip155' as const, reference: String(facetChainId) } },
										$actor: selection.entitySelector,
									}
		).$$internalTransfers}
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
