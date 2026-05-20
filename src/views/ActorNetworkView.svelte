<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { schema } from '$/schema/index.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { CoinInstanceType } from '$/schema/CoinInstance.ts'
	import { Source } from '$/sources/$Source.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		pageContent: _pageContent,
		entityId,
		title = 'Wallet on network',
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...entityViewRest
	}: WithRest<
		{
			pageContent?: Snippet
			entityId: EntityId<typeof schema, EntityType.ActorNetwork>
			title?: string
			href: string
			layout?: EntityLayout
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'layout'
			| 'open'
			| 'title'
			| 'Details'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'
	import { SvelteSet } from 'svelte/reactivity'

	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	const actorNetworkDetailAnchorKey = stringify(entityId)

	const network = useEntity(
		EntityType.Network,
		entityId.$network,
		{
			$: [
				Source.Constants_Internal,
				...(open ?
					[
						Source.Chainlist_Rest,
						Source.EthereumLists_Rest,
						Source.Lifi_Rest,
					]
				:
					[]
				),
			],
			name: {},
			$icon: {
				$: [
					Source.Constants_Internal,
					Source.Chainlist_Rest,
				],
			},
		},
	)

	const actor = useEntity(
		EntityType.Actor,
		entityId.$actor,
		{
			$: [
				Source.Voltaire_JsonRpc,
			],
			$primaryName: {},
			$icon: {},
		},
	)

	const actorNetwork = useEntity(
		EntityType.ActorNetwork,
		entityId,
		open ?
			{
				$$ownedCoins: {
					$: [
						Source.Allium_Rest,
					],
				},
				$$erc20TokenAllowances: {
					$: [
						Source.Blockscout_Rest,
					],
				},
				isContract: {
					$: [
						Source.Blockscout_Rest,
					],
				},
				$$transactions: {
					$: [
						Source.Blockscout_Rest,
					],
				},
				$$tokenTransfers: {
					$: [
						Source.Blockscout_Rest,
					],
				},
				$$internalTransactions: {
					$: [
						Source.Blockscout_Rest,
					],
				},
				transactionsCount: {
					$: [
						Source.Blockscout_Rest,
					],
				},
				transactionCount: {
					$: [
						Source.Blockscout_Rest,
					],
				},
				tokenTransferCount: {
					$: [
						Source.Blockscout_Rest,
					],
				},
				firstTransactionAt: {},
				lastTransactionAt: {},
				nftCount: {},
				contractPositions: {},
			}
		:
			{},
	)

	const allowances = derive(
		actorNetwork,
		(networkRow) => (
			[...(networkRow.$$erc20TokenAllowances ?? [])].map((value) => ({
				value,
			}))
		),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import Address from '$/views/Address.svelte'
	import BalancesView from '$/views/BalancesView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
	import NetworkView from '$/views/NetworkView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.ActorNetwork}
	{entityId}
	{title}
	{href}
	{layout}
	bind:open
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={actor}
			placeholderText=""
		>
			{#snippet children(actor)}
				{#if actor.$icon}
					<IconComponent
						shape={IconShape.Circle}
						src={actor.$icon[EntityMetaKey.Id].url}
						size="1.5em"
						alt=""
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={actor}
			placeholderText=""
		>
			{#snippet children(actor)}
				{actor.$primaryName?.[EntityMetaKey.Id].name ?? entityId.$actor.address}
			{/snippet}
		</ResourceBoundary>
		<small data-text="muted">
			{' '}·{' '}
			<ResourceBoundary
				resource={network}
				placeholderText="···"
			>
				{#snippet children(network)}
					{network.name ?? String(network[EntityMetaKey.Id].chainId)}
				{/snippet}
			</ResourceBoundary>
		</small>
	{/snippet}

	{#snippet Title()}
		<Address
			address={entityId.$actor.address}
			network={entityId.$network}
		/>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<ResourceBoundary
			resource={actor}
			placeholderText=""
		>
			{#snippet children(actor)}
				<ResourceBoundary
					resource={network}
					placeholderText="Loading network…"
				>
					{#snippet children(network)}
						<dl data-column-item="center">
							{#if contentOpen}
								{#if actor.$primaryName}
									<div>
										<dt>Primary ENS</dt>
										<dd data-text="mono">
											{actor.$primaryName[EntityMetaKey.Id].name}
										</dd>
									</div>
								{/if}
							{/if}
							{#if contentOpen}
								<div>
									<dt>CAIP-2</dt>
									<dd data-text="mono">
										<code>eip155:{String(entityId.$network.chainId)}</code>
									</dd>
								</div>
							{/if}
							{#if contentOpen}
								<div>
									<dt>Network</dt>
									<dd>
										<NetworkView
											entityId={entityId.$network}
											href={resolve(
												'/(explore)/(networks)/network/[networkId]',
												{ networkId: String(entityId.$network.chainId) },
											)}
											layout={EntityLayout.Title}
											open={false}
											showTypeAnnotation={false}
										/>
									</dd>
								</div>
							{/if}
							<ResourceBoundary
								resource={actorNetwork}
								placeholderText="Loading network activity…"
							>
								{#snippet children(actorNetwork)}
									{#if actorNetwork.transactionsCount !== undefined}
										<div>
											<dt>Transactions (count)</dt>
											<dd data-text="mono">{String(actorNetwork.transactionsCount)}</dd>
										</div>
									{/if}

									{#if actorNetwork.isContract !== undefined}
										<div>
											<dt>Contract</dt>
											<dd data-text="mono">{actorNetwork.isContract ? 'Yes' : 'No'}</dd>
										</div>
									{/if}

									{#if actorNetwork.transactionCount !== undefined}
										<div>
											<dt>Transaction count</dt>
											<dd data-text="mono">{String(actorNetwork.transactionCount)}</dd>
										</div>
									{/if}

									{#if actorNetwork.tokenTransferCount !== undefined}
										<div>
											<dt>Token transfers</dt>
											<dd data-text="mono">{String(actorNetwork.tokenTransferCount)}</dd>
										</div>
									{/if}

									{#if actorNetwork.nftCount !== undefined}
										<div>
											<dt>NFT items</dt>
											<dd data-text="mono">{String(actorNetwork.nftCount)}</dd>
										</div>
									{/if}

									{#if actorNetwork.firstTransactionAt !== undefined}
										<div>
											<dt>First activity at</dt>
											<dd data-text="mono">{String(actorNetwork.firstTransactionAt)}</dd>
										</div>
									{/if}

									{#if actorNetwork.lastTransactionAt !== undefined}
										<div>
											<dt>Last activity at</dt>
											<dd data-text="mono">{String(actorNetwork.lastTransactionAt)}</dd>
										</div>
									{/if}
								{/snippet}
							</ResourceBoundary>
						</dl>
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: detailsOpen,
	})}
		<EntityDetails
			entityType={EntityType.ActorNetwork}
			{entityId}
		/>

		<div
			class="actor-network-view-carousel-groups"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${actorNetworkDetailAnchorKey}:carousel-balances`}
				{...{ 'data-card': '' }}
				class="actor-network-view-collapsible-balances"
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _balancesSummary })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Balances</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers(_context)}
					{#if !actorNetwork.ready || (actorNetwork.current.$$ownedCoins ?? []).length > 0}
						<a
							data-scroll-marker-label="Tokens"
							href={`#${actorNetworkDetailAnchorKey}:actor-balances-tokens`}
						>Tokens</a>
					{/if}

					{#if !actorNetwork.ready || (actorNetwork.current.$$erc20TokenAllowances ?? []).length > 0}
						<a
							data-scroll-marker-label="Allowances"
							href={`#${actorNetworkDetailAnchorKey}:actor-balances-allowances`}
						>Allowances</a>
					{/if}

					{#if !actorNetwork.ready || (actorNetwork.current.contractPositions ?? []).length > 0}
						<a
							data-scroll-marker-label="Contract positions"
							href={`#${actorNetworkDetailAnchorKey}:actor-contract-positions`}
						>Positions</a>
					{/if}
				{/snippet}

				{#snippet body(_balancesCarousel)}
					<section id={`${actorNetworkDetailAnchorKey}:actor-balances-tokens`}>
						<BalancesView
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.ActorNetwork,
								entityId,
								fieldName: '$$ownedCoins',
							}}
							href={href}
							id={`${actorNetworkDetailAnchorKey}:actor-owned-coins`}
							title="Tokens"
						/>
					</section>
					<section id={`${actorNetworkDetailAnchorKey}:actor-balances-allowances`}>
						<EntitiesList
							collapsible={false}
							entityType={EntityType.ActorCoinAllowance}
							title="Approvals"
							href={href}
							id={`${actorNetworkDetailAnchorKey}:allowance-list`}
							getKey={(line) => stringify(line.value[EntityMetaKey.Id])}
							getSortValue={(line) => stringify(line.value[EntityMetaKey.Id])}
							placeholderKeys={new SvelteSet<string>()}
							placeholderText="Loading allowances…"
							resource={allowances}
							UnorderedListProps={{
								orientation: ListOrientation.Column,
							}}
						>
							{#snippet Empty()}
								<p data-text="muted">
									No approvals indexed for this wallet/network pair.
								</p>
							{/snippet}
							{#snippet Item(props)}
								{#if props.item}
									{@const row = props.item.value[EntityMetaKey.Id]}
									<div data-row="wrap align-center gap-3">
										<span data-text="annotation">Spender</span>
										<ActorNetworkView
											entityId={{
												$network: entityId.$network,
												$actor: { address: row.$spender.address },
											}}
											href={resolve(
												'/(explore)/(networks)/network/[networkId]/(network)/(accounts)/account/[address]',
												{
													networkId: String(entityId.$network.chainId),
													address: row.$spender.address,
												},
											)}
											layout={EntityLayout.Title}
											showTypeAnnotation={false}
										/>
										<span data-text="annotation">Asset</span>
										{#if row.$actorCoin.$coinInstance.type === CoinInstanceType.NativeCurrency}
											<span data-text="muted">Native gas token</span>
										{:else if row.$actorCoin.$coinInstance.type === CoinInstanceType.Erc20Token}
											<EvmContractView
												entityId={{
													$network: entityId.$network,
													address: row.$actorCoin.$coinInstance.$contract.address,
												}}
												href={resolve(
													'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
													{
														networkId: String(entityId.$network.chainId),
														address: row.$actorCoin.$coinInstance.$contract.address,
													},
												)}
												layout={EntityLayout.Title}
												showTypeAnnotation={false}
											/>
										{:else}
											<span data-text="muted">—</span>
										{/if}
									</div>
								{/if}
							{/snippet}
						</EntitiesList>
					</section>
					<section id={`${actorNetworkDetailAnchorKey}:actor-contract-positions`}>
						<ResourceBoundary
							resource={actorNetwork}
							placeholderText="Loading positions…"
						>
							{#snippet children(actorNetwork)}
								{#if (actorNetwork.contractPositions ?? []).length}
									<ul data-list="unstyled">
										{#each actorNetwork.contractPositions ?? [] as row (`${row.protocol.key}:${row.name}`)}
											<li data-column="gap-1">
												<div data-row="wrap align-baseline gap-2">
													<strong>{row.name}</strong>
													<span data-text="muted">{row.protocol.name}</span>
												</div>
												{#if row.pool != null}
													<div data-row="wrap align-center gap-2">
														<EvmContractView
															entityId={{
																$network: entityId.$network,
																address: row.pool.address,
															}}
															href={resolve(
																'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
																{
																	networkId: String(entityId.$network.chainId),
																	address: row.pool.address,
																},
															)}
															layout={EntityLayout.Title}
															showTypeAnnotation={false}
														/>
														{#if row.pool.name != null}
															<span data-text="muted">{row.pool.name}</span>
														{/if}
													</div>
												{/if}
												<div data-text="annotation">
													Value {String(row.value)}
												</div>
											</li>
										{/each}
									</ul>
								{:else}
									<p data-text="muted">
										No contract positions on this row.
									</p>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</section>
				{/snippet}
			</CollapsibleTabs>

			<CollapsibleTabs
				id={`${actorNetworkDetailAnchorKey}:carousel-activity`}
					{...{ 'data-card': '' }}
					class="actor-network-view-collapsible-activity"
					scrollContainerProps={{
						'data-row': 'start align-start',
					}}
				>
					{#snippet Summary({ open: _activitySummary })}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Activity</HeadingComponent>
						</header>
					{/snippet}

					{#snippet Markers(_context)}
						{#if (
							actorNetwork.current.transactionsCount !== undefined
							|| actorNetwork.current.transactionCount !== undefined
							|| actorNetwork.current.tokenTransferCount !== undefined
							|| actorNetwork.current.nftCount !== undefined
							|| actorNetwork.current.firstTransactionAt !== undefined
							|| actorNetwork.current.lastTransactionAt !== undefined
						)}
							<a
								data-scroll-marker-label="Summary"
								href={`#${actorNetworkDetailAnchorKey}:activity-summary`}
							>Summary</a>
						{/if}
						<a
							data-scroll-marker-label="Transactions"
							href={`#${actorNetworkDetailAnchorKey}:activity-transactions`}
						>Transactions</a>
						{#if (
							actorNetwork.current.tokenTransferCount !== undefined
							|| !actorNetwork.ready
							|| (actorNetwork.current.$$tokenTransfers ?? []).length > 0
						)}
							<a
								data-scroll-marker-label="Token transfers"
								href={`#${actorNetworkDetailAnchorKey}:activity-token-transfers`}
							>Token transfers</a>
						{/if}
						{#if (
							!actorNetwork.ready
							|| (actorNetwork.current.$$internalTransactions ?? []).length > 0
						)}
							<a
								data-scroll-marker-label="Internal transactions"
								href={`#${actorNetworkDetailAnchorKey}:activity-internal-transactions`}
							>Internal transactions</a>
						{/if}
						<a
							data-scroll-marker-label="Receipt logs"
							href={`#${actorNetworkDetailAnchorKey}:activity-receipt-logs`}
						>Receipt logs</a>
					{/snippet}

					{#snippet body(_activityChildren)}
						<ResourceBoundary
							resource={actorNetwork}
							placeholderText="Loading activity…"
						>
							{#snippet children(actorNetwork)}
								{#if (
									actorNetwork.transactionsCount !== undefined
									|| actorNetwork.transactionCount !== undefined
									|| actorNetwork.tokenTransferCount !== undefined
									|| actorNetwork.nftCount !== undefined
									|| actorNetwork.firstTransactionAt !== undefined
									|| actorNetwork.lastTransactionAt !== undefined
								)}
									<section
										data-scroll-marker-label="Summary"
										id={`${actorNetworkDetailAnchorKey}:activity-summary`}
									>
										<dl data-column-item="center">
											{#if actorNetwork.transactionsCount !== undefined}
												<div>
													<dt>Transactions (count)</dt>
													<dd>
														<NumberValue value={actorNetwork.transactionsCount} />
													</dd>
												</div>
											{/if}

											{#if actorNetwork.transactionCount !== undefined}
												<div>
													<dt>Transaction count</dt>
													<dd data-text="mono">{String(actorNetwork.transactionCount)}</dd>
												</div>
											{/if}

											{#if actorNetwork.tokenTransferCount !== undefined}
												<div>
													<dt>Token transfers (indexer)</dt>
													<dd data-text="mono">{String(actorNetwork.tokenTransferCount)}</dd>
												</div>
											{/if}

											{#if actorNetwork.nftCount !== undefined}
												<div>
													<dt>NFT items (indexer)</dt>
													<dd data-text="mono">{String(actorNetwork.nftCount)}</dd>
												</div>
											{/if}

											{#if actorNetwork.firstTransactionAt !== undefined}
												<div>
													<dt>First activity at</dt>
													<dd data-text="mono">{String(actorNetwork.firstTransactionAt)}</dd>
												</div>
											{/if}

											{#if actorNetwork.lastTransactionAt !== undefined}
												<div>
													<dt>Last activity at</dt>
													<dd data-text="mono">{String(actorNetwork.lastTransactionAt)}</dd>
												</div>
											{/if}
										</dl>
									</section>
								{/if}

								<section id={`${actorNetworkDetailAnchorKey}:activity-transactions`}>
									<EvmTransactionsView
										collapsible={false}
										entityFieldReference={{
											entityType: EntityType.ActorNetwork,
											entityId,
											fieldName: '$$transactions',
										}}
										href={href}
										id={`${actorNetworkDetailAnchorKey}:activity-tx`}
									/>
								</section>

								<section
									data-scroll-marker-label="Token transfers"
									id={`${actorNetworkDetailAnchorKey}:activity-token-transfers`}
								>
									<EvmTransactionsView
										collapsible={false}
										entityFieldReference={{
											entityType: EntityType.ActorNetwork,
											entityId,
											fieldName: '$$tokenTransfers',
										}}
										href={href}
										id={`${actorNetworkDetailAnchorKey}:activity-token-tx-transfers`}
										title="Token transfers"
									/>
								</section>

								<section
									data-scroll-marker-label="Internal transactions"
									id={`${actorNetworkDetailAnchorKey}:activity-internal-transactions`}
								>
									<EvmTransactionsView
										collapsible={false}
										entityFieldReference={{
											entityType: EntityType.ActorNetwork,
											entityId,
											fieldName: '$$internalTransactions',
										}}
										href={href}
										id={`${actorNetworkDetailAnchorKey}:activity-internal-tx`}
										title="Internal transactions"
									/>
								</section>

								<section
									data-scroll-marker-label="Receipt logs"
									id={`${actorNetworkDetailAnchorKey}:activity-receipt-logs`}
								>
									<div data-row="wrap align-center gap-2">
										<span data-text="annotation">Receipt logs</span>
										<Tooltip
											content="Open a transaction above for receipt log rows resolved as EvmLog entities on that transaction’s $$logs field."
											contentProps={{ side: 'top' }}
										>
											<abbr
												class="entity-heading-tip"
												aria-label="Receipt logs"
											>ⓘ</abbr>
										</Tooltip>
									</div>
								</section>
							{/snippet}
						</ResourceBoundary>
					{/snippet}
				</CollapsibleTabs>
		</div>

		{#if _pageContent}
			{@render _pageContent()}
		{/if}
	{/snippet}
</EntityView>


<style>
	.actor-network-view-carousel-groups :global(.carousel) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 40ch;
			}
		}
	}
</style>
