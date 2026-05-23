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
		title = 'Network account',
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
	import { blo } from 'blo'
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
				$: [
					Source.Blockscout_Rest,
				],
				$$erc20TokenAllowances: {},
				isContract: {},
				$$transactions: {},
				$$tokenTransfers: {},
				$$internalTransactions: {},
				transactionsCount: {},
				tokenTransferCount: {},
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
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import Address from '$/views/Address.svelte'
	import ActorView from '$/views/ActorView.svelte'
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
			{#snippet Pending()}
				<IconComponent
					alt=""
					shape={IconShape.Square}
					src={blo(entityId.$actor.address)}
					size="1.5em"
				/>
			{/snippet}

			{#snippet children(actor)}
				{@const avatarUrl = actor.$icon?.[EntityMetaKey.Id].url}
				<IconComponent
					alt=""
					shape={avatarUrl ? IconShape.Circle : IconShape.Square}
					src={avatarUrl ?? blo(entityId.$actor.address)}
					size="1.5em"
				/>
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
			{' '}on{' '}
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

	{#snippet Value()}
		<Address
			address={entityId.$actor.address}
			network={entityId.$network}
		/>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<dl data-column-item="center">
			{#if contentOpen}
				<div>
					<dt>Account</dt>
					<dd>
						<ActorView
							entityId={entityId.$actor}
							href={resolve('/account/[address]', {
								address: entityId.$actor.address,
							})}
							layout={EntityLayout.Title}
							open={false}
							showTypeAnnotation={false}
						/>
					</dd>
				</div>
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
			{#if contentOpen}
				<div>
					<dt>Transactions</dt>
					<dd>
						<ResourceBoundary
							resource={actorNetwork}
							placeholderText="Loading network activity…"
						>
							{#snippet children(actorNetwork)}
								{#if actorNetwork.transactionsCount !== undefined}
									<NumberValue value={actorNetwork.transactionsCount} />
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
			{#if contentOpen}
				<ResourceBoundary
					resource={actorNetwork}
					placeholderText="Loading network activity…"
				>
					{#snippet children(actorNetwork)}
						{#if actorNetwork.isContract === true}
							<div>
								<dt>Contract</dt>
								<dd>
									<EvmContractView
										entityId={{
											$network: entityId.$network,
											address: entityId.$actor.address,
										}}
										href={resolve(
											'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
											{
												networkId: String(entityId.$network.chainId),
												address: entityId.$actor.address,
											},
										)}
										layout={EntityLayout.Title}
										open={false}
										showTypeAnnotation={false}
									/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
			{#if contentOpen}
				<div>
					<dt>Token transfers</dt>
					<dd>
						<ResourceBoundary
							resource={actorNetwork}
							placeholderText="Loading network activity…"
						>
							{#snippet children(actorNetwork)}
								{#if actorNetwork.tokenTransferCount !== undefined}
									<NumberValue value={actorNetwork.tokenTransferCount} />
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
			{#if contentOpen}
				<div>
					<dt>NFT items</dt>
					<dd>
						<ResourceBoundary
							resource={actorNetwork}
							placeholderText="Loading network activity…"
						>
							{#snippet children(actorNetwork)}
								{#if actorNetwork.nftCount !== undefined}
									<NumberValue value={actorNetwork.nftCount} />
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
			{#if contentOpen}
				<div>
					<dt>First activity at</dt>
					<dd>
						<ResourceBoundary
							resource={actorNetwork}
							placeholderText="Loading network activity…"
						>
							{#snippet children(actorNetwork)}
								{#if actorNetwork.firstTransactionAt !== undefined}
									<Timestamp timestamp={actorNetwork.firstTransactionAt} />
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
			{#if contentOpen}
				<div>
					<dt>Last activity at</dt>
					<dd>
						<ResourceBoundary
							resource={actorNetwork}
							placeholderText="Loading network activity…"
						>
							{#snippet children(actorNetwork)}
								{#if actorNetwork.lastTransactionAt !== undefined}
									<Timestamp timestamp={actorNetwork.lastTransactionAt} />
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
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
						<a
							data-scroll-marker-label="Transactions"
							href={`#${actorNetworkDetailAnchorKey}:activity-transactions`}
						>Transactions</a>
						{#if (
							!actorNetwork.ready
							|| actorNetwork.current.tokenTransferCount !== undefined
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
					{/snippet}

					{#snippet body(_activityChildren)}
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
					{/snippet}
				</CollapsibleTabs>
		</div>

		{#if _pageContent}
			{@render _pageContent()}
		{/if}
	{/snippet}
</EntityView>

