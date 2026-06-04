<script lang="ts">
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


	// State
	let {
		pageContent,
		entityId,
		href = `/network/${entityId.$network.caip2.namespace}:${entityId.$network.caip2.reference}/account/${entityId.$actor.address}`,
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

	import { evmChainIdFromCaip2 } from '$/lib/caip.ts'
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
				$$internalTransfers: {},
				transactionCount: {},
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
	import CollapsibleTabs, { collapsibleTabsSections } from '$/components/CollapsibleTabs.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import BalancesView from '$/views/BalancesView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmInternalTransfersView from '$/views/EvmInternalTransfersView.svelte'
	import EvmTokenTransfersView from '$/views/EvmTokenTransfersView.svelte'
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
				/>
			{/snippet}

			{#snippet children(actor)}
				{@const avatarUrl = actor.$icon?.[EntityMetaKey.Id].url}
				<IconComponent
					alt=""
					shape={avatarUrl ? IconShape.Circle : IconShape.Square}
					src={avatarUrl ?? blo(entityId.$actor.address)}
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
			A wallet on one execution network: token balances (Allium where supported), Blockscout activity, and DeFi positions on the same chain id as the parent network evmNetworkAccount.
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
						<code>eip155:{String(evmChainIdFromCaip2(`${entityId.$network.caip2.namespace}:${entityId.$network.caip2.reference}`))}</code>
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
								{#if evmNetworkAccount.transactionCount !== undefined}
									<NumberValue value={evmNetworkAccount.transactionCount} />
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
										layout={EntityLayout.Value}
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
		<CollapsibleTabs
			id={`${evmNetworkAccountDetailAnchorKey}:carousel-balances`}
			sectionIdPrefix={evmNetworkAccountDetailAnchorKey}
			sections={collapsibleTabsSections([
				{ id: 'actor-balances-tokens', label: 'Tokens' },
				{ id: 'actor-contract-positions', label: 'Positions' },
			])}
			data-card
			class="actor-network-view-collapsible-balances"
		>
			{#snippet Summary({ open: _balancesSummary })}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Balances</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionActorBalancesTokens({ id: _tokensId, label: _tokensLabel })}
				<BalancesView
					CollapsibleProps={{ canToggle: false }}
					href={href}
					collapsible={false}
					entityFieldReference={{
						entityType: EntityType.EvmNetworkAccount,
						entityId,
						fieldName: '$$ownedCoins',
					}}
					id={`${evmNetworkAccountDetailAnchorKey}:actor-owned-coins`}
					title="Tokens"
				/>
			{/snippet}

			{#snippet SectionActorContractPositions({ id: _positionsId, label: _positionsLabel })}
				<ResourceBoundary
					resource={evmNetworkAccount}
					placeholderText="Loading positions…"
				>
					{#snippet children(evmNetworkAccount)}
						{#if (evmNetworkAccount.contractPositions ?? []).length}
							<ul data-evmNetworkAccounts="unstyled">
								{#each evmNetworkAccount.contractPositions ?? [] as contractPosition (`${contractPosition.protocol.key}:${contractPosition.name}`)}
									<li data-column="gap-1">
										<div data-row="wrap align-baseline gap-2">
											<strong>{contractPosition.name}</strong>
											<span data-text="muted">{contractPosition.protocol.name}</span>
										</div>
										{#if contractPosition.pool != null}
											<div data-row="wrap align-center gap-2">
												<EvmContractView
													entityId={{
														$network: entityId.$network,
														address: contractPosition.pool.address,
													}}
													layout={EntityLayout.Title}
												/>
												{#if contractPosition.pool.name != null}
													<span data-text="muted">{contractPosition.pool.name}</span>
												{/if}
											</div>
										{/if}
										<div data-text="annotation">
											Value {String(contractPosition.value)}
										</div>
									</li>
								{/each}
							</ul>
						{:else}
							<p data-text="muted">
								No contract positions on this evmNetworkAccount.
							</p>
						{/if}
					{/snippet}
				</ResourceBoundary>
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
				) ?
					([{ id: 'activity-token-transfers', label: 'Token transfers' }] as const)
				:
					[],
				...(
					!evmNetworkAccount.ready
					|| (evmNetworkAccount.current.$$internalTransfers ?? []).length > 0
				) ?
					([{ id: 'activity-internal-transfers', label: 'Internal transfers' }] as const)
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

			{#snippet SectionActivityTransactions({ id: _transactionsId, label: _transactionsLabel })}
				<EvmTransactionsView
					CollapsibleProps={{ canToggle: false }}
					href={href}
					collapsible={false}
					entityFieldReference={{
						entityType: EntityType.EvmNetworkAccount,
						entityId,
						fieldName: '$$transactions',
					}}
					id={`${evmNetworkAccountDetailAnchorKey}:activity-tx`}
				/>
			{/snippet}

			{#snippet SectionActivityTokenTransfers({ id: _tokenTransfersId, label: _tokenTransfersLabel })}
				<EvmTokenTransfersView
					CollapsibleProps={{ canToggle: false }}
					href={href}
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

			{#snippet SectionActivityInternalTransfers({ id: _internalTransfersId, label: _internalTransfersLabel })}
				<EvmInternalTransfersView
					CollapsibleProps={{ canToggle: false }}
					href={href}
					collapsible={false}
					entityFieldReference={{
						entityType: EntityType.EvmNetworkAccount,
						entityId,
						fieldName: '$$internalTransfers',
					}}
					id={`${evmNetworkAccountDetailAnchorKey}:activity-internal-tx`}
					title="Internal transfers"
				/>
			{/snippet}
		</CollapsibleTabs>

		{#if pageContent}
			{@render pageContent()}
		{/if}
	{/snippet}
</EntityView>
