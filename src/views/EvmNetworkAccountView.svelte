<script lang="ts">
	// Types/constants
	import {
		caip2RouteParamsFromNetworkId,
		evmChainIdFromNetworkId,
	} from '$/lib/caip.ts'


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
				...caip2RouteParamsFromNetworkId(entityId.$network),
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
			entityId: EntityId<typeof schema, EntityType.EvmNetworkAccount>
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

	const evmNetworkAccountDetailAnchorKey = stringify(entityId)

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
		EntityType.EvmAccount,
		entityId.$actor,
		{
			$: [
				Source.Voltaire_JsonRpc,
			],
			$primaryName: {},
			$icon: {},
		},
	)

	const evmNetworkAccount = useEntity(
		EntityType.EvmNetworkAccount,
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
	import BalancesView from '$/views/BalancesView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetworkAccount}
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
					size="1.25em"
				/>
			{/snippet}

			{#snippet children(actor)}
				{@const avatarUrl = actor.$icon?.[EntityMetaKey.Id].url}
				<IconComponent
					alt=""
					shape={avatarUrl ? IconShape.Circle : IconShape.Square}
					src={avatarUrl ?? blo(entityId.$actor.address)}
					size="1.25em"
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={actor}
		>
			{#snippet children(actor)}
				{#if actor.$primaryName?.[EntityMetaKey.Id].name}
					{actor.$primaryName?.[EntityMetaKey.Id].name}
				{:else}
					<TruncatedValue
						format={TruncatedValueFormat.Visual}
						value={entityId.$actor.address}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		{@render Value()}

		<small data-row="inline align-center wrap" data-text="muted">
			{' '}on{' '}
			<ResourceBoundary
				resource={network}
				placeholderText="···"
			>
				{#snippet children(network)}
					<EvmNetworkView
						entityId={entityId.$network}
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		</small>
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
						<TruncatedValue
							format={TruncatedValueFormat.Visual}
							value={entityId.$actor.address}
						/>
					</dd>
				</div>
			{/if}
			{#if contentOpen}
				<div>
					<dt>CAIP-2</dt>
					<dd data-text="mono">
						<code>eip155:{String(evmChainIdFromNetworkId(entityId.$network))}</code>
					</dd>
				</div>
			{/if}
			{#if contentOpen}
				<div>
					<dt>Network</dt>
					<dd>
						<EvmNetworkView
							entityId={entityId.$network}
							layout={EntityLayout.Value}
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
							resource={evmNetworkAccount}
							placeholderText="Loading network activity…"
						>
							{#snippet children(evmNetworkAccount)}
								{#if evmNetworkAccount.transactionsCount !== undefined}
									<NumberValue value={evmNetworkAccount.transactionsCount} />
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
			{#if contentOpen}
				<ResourceBoundary
					resource={evmNetworkAccount}
					placeholderText="Loading network activity…"
				>
					{#snippet children(evmNetworkAccount)}
						{#if evmNetworkAccount.isContract === true}
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
							resource={evmNetworkAccount}
							placeholderText="Loading network activity…"
						>
							{#snippet children(evmNetworkAccount)}
								{#if evmNetworkAccount.tokenTransferCount !== undefined}
									<NumberValue value={evmNetworkAccount.tokenTransferCount} />
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
							resource={evmNetworkAccount}
							placeholderText="Loading network activity…"
						>
							{#snippet children(evmNetworkAccount)}
								{#if evmNetworkAccount.nftCount !== undefined}
									<NumberValue value={evmNetworkAccount.nftCount} />
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
							resource={evmNetworkAccount}
							placeholderText="Loading network activity…"
						>
							{#snippet children(evmNetworkAccount)}
								{#if evmNetworkAccount.firstTransactionAt !== undefined}
									<Timestamp timestamp={evmNetworkAccount.firstTransactionAt} />
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
							resource={evmNetworkAccount}
							placeholderText="Loading network activity…"
						>
							{#snippet children(evmNetworkAccount)}
								{#if evmNetworkAccount.lastTransactionAt !== undefined}
									<Timestamp timestamp={evmNetworkAccount.lastTransactionAt} />
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
			entityType={EntityType.EvmNetworkAccount}
			{entityId}
		/>
		<CollapsibleTabs
			id={`${evmNetworkAccountDetailAnchorKey}:carousel-balances`}
			data-card
			class="actor-network-view-collapsible-balances"
		>
				{#snippet Summary({ open: _balancesSummary })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Balances</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					{#if !evmNetworkAccount.ready || (evmNetworkAccount.current.$$ownedCoins ?? []).length > 0}
						<a
							data-scroll-marker-label="Tokens"
							href={`#${evmNetworkAccountDetailAnchorKey}:actor-balances-tokens`}
						>Tokens</a>
					{/if}

					{#if !evmNetworkAccount.ready || (evmNetworkAccount.current.contractPositions ?? []).length > 0}
						<a
							data-scroll-marker-label="Contract positions"
							href={`#${evmNetworkAccountDetailAnchorKey}:actor-contract-positions`}
						>Positions</a>
					{/if}
				{/snippet}

				{#snippet body({ open: _bodyOpen })}
					<section id={`${evmNetworkAccountDetailAnchorKey}:actor-balances-tokens`}>
						<BalancesView
							CollapsibleProps={{ canToggle: false }}
							href={resolve(
								'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(accounts)/account/[address]',
								{
								...caip2RouteParamsFromNetworkId(entityId.$network),
								address: entityId.$actor.address,
								},
		)}
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.EvmNetworkAccount,
								entityId,
								fieldName: '$$ownedCoins',
							}}
							id={`${evmNetworkAccountDetailAnchorKey}:actor-owned-coins`}
							title="Tokens"
						/>
					</section>

					<section id={`${evmNetworkAccountDetailAnchorKey}:actor-contract-positions`}>
						<ResourceBoundary
							resource={evmNetworkAccount}
							placeholderText="Loading positions…"
						>
							{#snippet children(evmNetworkAccount)}
								{#if (evmNetworkAccount.contractPositions ?? []).length}
									<ul data-list="unstyled">
										{#each evmNetworkAccount.contractPositions ?? [] as row (`${row.protocol.key}:${row.name}`)}
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
			id={`${evmNetworkAccountDetailAnchorKey}:carousel-activity`}
			sectionIdPrefix={evmNetworkAccountDetailAnchorKey}
			sections={[
				{ id: 'activity-transactions', label: 'Transactions' },
				...(
					!evmNetworkAccount.ready
					|| evmNetworkAccount.current.tokenTransferCount !== undefined
					|| (evmNetworkAccount.current.$$tokenTransfers ?? []).length > 0
				) ? ([{ id: 'activity-token-transfers', label: 'Token transfers' }] as const)
				:
					[],
				...(
					!evmNetworkAccount.ready
					|| (evmNetworkAccount.current.$$internalTransactions ?? []).length > 0
				) ? ([{ id: 'activity-internal-transactions', label: 'Internal transactions' }] as const)
				:
					[],
			]}
			data-card
			class="actor-network-view-collapsible-activity"
		>
			{#snippet Summary({ open: _activitySummary })}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionActivityTransactions({ id, label })}
				<EvmTransactionsView
					CollapsibleProps={{ canToggle: false }}
					href={resolve(
						'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(accounts)/account/[address]',
						{
						...caip2RouteParamsFromNetworkId(entityId.$network),
						address: entityId.$actor.address,
						},
					)}
					collapsible={false}
					entityFieldReference={{
						entityType: EntityType.EvmNetworkAccount,
						entityId,
						fieldName: '$$transactions',
					}}
					id={`${evmNetworkAccountDetailAnchorKey}:activity-tx`}
				/>
			{/snippet}

			{#snippet SectionActivityTokenTransfers({ id, label })}
				<EvmTransactionsView
					CollapsibleProps={{ canToggle: false }}
					href={resolve(
						'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(accounts)/account/[address]',
						{
						...caip2RouteParamsFromNetworkId(entityId.$network),
						address: entityId.$actor.address,
						},
					)}
					collapsible={false}
					entityFieldReference={{
						entityType: EntityType.EvmNetworkAccount,
						entityId,
						fieldName: '$$tokenTransfers',
					}}
					id={`${evmNetworkAccountDetailAnchorKey}:activity-token-tx-transfers`}
					title="Token transfers"
				/>
			{/snippet}

				{#snippet SectionActivityInternalTransactions({ id, label })}
					<EvmTransactionsView
						CollapsibleProps={{ canToggle: false }}
						href={resolve(
							'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(accounts)/account/[address]',
							{
							...caip2RouteParamsFromNetworkId(entityId.$network),
							address: entityId.$actor.address,
							},
						)}
						collapsible={false}
						entityFieldReference={{
							entityType: EntityType.EvmNetworkAccount,
							entityId,
							fieldName: '$$internalTransactions',
						}}
						id={`${evmNetworkAccountDetailAnchorKey}:activity-internal-tx`}
						title="Internal transactions"
					/>
				{/snippet}
		</CollapsibleTabs>

		{#if pageContent}
			{@render pageContent()}
		{/if}
	{/snippet}
</EntityView>
