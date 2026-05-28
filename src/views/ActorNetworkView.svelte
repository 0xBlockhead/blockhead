<script lang="ts">
	// Types/constants
	import { caip2RouteParamsFromEvmChainId } from '$/lib/caip.ts'


	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { schema } from '$/schema/index.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { Source } from '$/sources/$Source.ts'
	import { blo } from 'blo'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		pageContent,
		entityId,
		href = resolve(
			'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(accounts)/account/[address]',
			{
				...caip2RouteParamsFromEvmChainId(entityId.$network.chainId),
				address: entityId.$actor.address,
			},
		),
		title = 'Network account',
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			pageContent?: Snippet
			entityId: EntityId<typeof schema, EntityType.ActorNetwork>
			href?: string
			title?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'showTypeAnnotation'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const actorNetworkDetailAnchorKey = stringify(entityId)

	const network = useEntity(
		EntityType.EvmNetwork,
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


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import Address from '$/views/Address.svelte'
	import BalancesView from '$/views/BalancesView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.ActorNetwork}
	{entityId}
	href={href}
	{title}
	{layout}
	bind:open
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

	{#snippet TypeAnnotationTooltip()}
		<p>
			A wallet on one execution network: token balances (Allium where supported), Blockscout activity, and DeFi positions on the same chain id as the parent network row.
		</p>
		<p>
			<strong>ERC-20 token approvals</strong>
			are not listed here yet—explorers index transfers, not every historical <code>Approval</code> event. When owner, token, and spender are known, allowance amounts can still be read on-chain via execution RPC.
		</p>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={actor}
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
						<Address
							address={entityId.$actor.address}
							actorId={entityId.$actor}
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
						<EvmNetworkView
							entityId={entityId.$network}
							layout={EntityLayout.Title}
							open={false}
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
										layout={EntityLayout.SummaryDetails}
										open={true}
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

				{#snippet Markers({ open: _markersOpen })}
					{#if !actorNetwork.ready || (actorNetwork.current.$$ownedCoins ?? []).length > 0}
						<a
							data-scroll-marker-label="Tokens"
							href={`#${actorNetworkDetailAnchorKey}:actor-balances-tokens`}
						>Tokens</a>
					{/if}

					{#if !actorNetwork.ready || (actorNetwork.current.contractPositions ?? []).length > 0}
						<a
							data-scroll-marker-label="Contract positions"
							href={`#${actorNetworkDetailAnchorKey}:actor-contract-positions`}
						>Positions</a>
					{/if}
				{/snippet}

				{#snippet body({ open: _bodyOpen })}
					<section id={`${actorNetworkDetailAnchorKey}:actor-balances-tokens`}>
						<BalancesView
							href={resolve(
								'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(accounts)/account/[address]',
								{
								...caip2RouteParamsFromEvmChainId(entityId.$network.chainId),
								address: entityId.$actor.address,
								},
		)}
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.ActorNetwork,
								entityId,
								fieldName: '$$ownedCoins',
							}}
							id={`${actorNetworkDetailAnchorKey}:actor-owned-coins`}
							title="Tokens"
						/>
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
															layout={EntityLayout.Title}
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
				sectionIdPrefix={actorNetworkDetailAnchorKey}
				sections={[
					{ id: 'activity-transactions', label: 'Transactions' },
					...(
						!actorNetwork.ready
						|| actorNetwork.current.tokenTransferCount !== undefined
						|| (actorNetwork.current.$$tokenTransfers ?? []).length > 0
					) ? [{ id: 'activity-token-transfers', label: 'Token transfers' }] : [],
					...(
						!actorNetwork.ready
						|| (actorNetwork.current.$$internalTransactions ?? []).length > 0
					) ? [{ id: 'activity-internal-transactions', label: 'Internal transactions' }] : [],
				]}
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

					{#snippet SectionActivityTransactions({ id, label })}
						<EvmTransactionsView
							href={resolve(
								'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(accounts)/account/[address]',
								{
								...caip2RouteParamsFromEvmChainId(entityId.$network.chainId),
								address: entityId.$actor.address,
								},
	)}
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.ActorNetwork,
								entityId,
								fieldName: '$$transactions',
							}}
							id={`${actorNetworkDetailAnchorKey}:activity-tx`}
						/>
					{/snippet}

					{#snippet SectionActivityTokenTransfers({ id, label })}
						<EvmTransactionsView
							href={resolve(
								'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(accounts)/account/[address]',
								{
								...caip2RouteParamsFromEvmChainId(entityId.$network.chainId),
								address: entityId.$actor.address,
								},
	)}
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.ActorNetwork,
								entityId,
								fieldName: '$$tokenTransfers',
							}}
							id={`${actorNetworkDetailAnchorKey}:activity-token-tx-transfers`}
							title="Token transfers"
						/>
					{/snippet}

					{#snippet SectionActivityInternalTransactions({ id, label })}
						<EvmTransactionsView
							href={resolve(
								'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(accounts)/account/[address]',
								{
								...caip2RouteParamsFromEvmChainId(entityId.$network.chainId),
								address: entityId.$actor.address,
								},
	)}
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.ActorNetwork,
								entityId,
								fieldName: '$$internalTransactions',
							}}
							id={`${actorNetworkDetailAnchorKey}:activity-internal-tx`}
							title="Internal transactions"
						/>
					{/snippet}
				</CollapsibleTabs>
		</div>

		{#if pageContent}
			{@render pageContent()}
		{/if}
	{/snippet}
</EntityView>


