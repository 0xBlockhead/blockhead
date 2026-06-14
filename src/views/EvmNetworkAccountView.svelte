<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { EntitySelector } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import { blo } from 'blo'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		pageContent,
		selector,
		href = resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(accounts)/account/[address]', {
			caip2Namespace: selector.$network.caip2.namespace,
			caip2Reference: selector.$network.caip2.reference,
			address: selector.$actor.address,
		}),
		title = 'Network account',
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			pageContent?: Snippet
			selector: EntitySelector<typeof schema, EntityType.EvmNetworkAccount>
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
	import { subscribe } from '$/routes/+layout.svelte'

	const evmNetworkAccountDetailAnchorKey = stringify(selector)

	const network = subscribe(EntityType.EvmNetwork,
		selector.$network,
		({ sources: [
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
			], fields: { name: true, $icon: ({ sources: [
					Source.Constants_Internal,
					Source.Chainlist_Rest,
				] }) } }),
	)

	const actor = subscribe(EntityType.EvmAccount,
		selector.$actor,
		({ sources: [
				Source.Voltaire_JsonRpc,
			], fields: { $primaryName: true, $icon: true } }),
	)

	const evmNetworkAccount = subscribe(EntityType.EvmNetworkAccount,
		selector,
		open ?
			{
				sources: [
					Source.Blockscout_Rest,
				],
				fields: {
					$$ownedCoins: {
						sources: [
							Source.Allium_Rest,
						],
					},
					isContract: true,
					$$transactions: true,
					$$tokenTransfers: true,
					$$internalTransfers: true,
					transactionCount: true,
					tokenTransferCount: true,
					firstTransactionAt: true,
					lastTransactionAt: true,
					nftCount: true,
					contractPositions: true,
				},
			}
		:
			{ fields: {} },
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
	entitySelector={selector}
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
					src={blo(selector.$actor.address)}
				/>
			{/snippet}

			{#snippet children(actor)}
				{@const avatarUrl = actor.fields.$icon?.[EntityMetaKey.Selector].url}
				<IconComponent
					alt=""
					shape={avatarUrl ? IconShape.Circle : IconShape.Square}
					src={avatarUrl ?? blo(selector.$actor.address)}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={actor}
		>
			{#snippet children(actor)}
				{#if actor.fields.$primaryName?.[EntityMetaKey.Selector].name}
					{actor.fields.$primaryName?.[EntityMetaKey.Selector].name}
				{:else}
					<TruncatedValue
						format={TruncatedValueFormat.Visual}
						value={selector.$actor.address}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<TruncatedValue
			format={TruncatedValueFormat.Visual}
			value={selector.$actor.address}
		/>

		<small data-row="inline align-center wrap" data-text="muted">
			{' '}on{' '}
			<ResourceBoundary
				resource={network}
				placeholderText="···"
			>
				{#snippet children(network)}
					<EvmNetworkView
						selector={selector.$network}
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
							value={selector.$actor.address}
						/>
					</dd>
				</div>
			{/if}
			{#if contentOpen}
				<div>
					<dt>CAIP-2</dt>
					<dd data-text="mono">
						<code>eip155:{String(evmChainIdFromCaip2(`${selector.$network.caip2.namespace}:${selector.$network.caip2.reference}`))}</code>
					</dd>
				</div>
			{/if}
			{#if contentOpen}
				<div>
					<dt>Network</dt>
					<dd>
						<EvmNetworkView
							selector={selector.$network}
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
								{#if evmNetworkAccount.fields.transactionCount !== undefined}
									<NumberValue value={evmNetworkAccount.fields.transactionCount} />
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
						{#if evmNetworkAccount.fields.isContract === true}
							<div>
								<dt>Contract</dt>
								<dd>
									<EvmContractView
										selector={{
											$network: selector.$network,
											address: selector.$actor.address,
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
								{#if evmNetworkAccount.fields.tokenTransferCount !== undefined}
									<NumberValue value={evmNetworkAccount.fields.tokenTransferCount} />
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
								{#if evmNetworkAccount.fields.nftCount !== undefined}
									<NumberValue value={evmNetworkAccount.fields.nftCount} />
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
								{#if evmNetworkAccount.fields.firstTransactionAt !== undefined}
									<Timestamp timestamp={evmNetworkAccount.fields.firstTransactionAt} />
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
								{#if evmNetworkAccount.fields.lastTransactionAt !== undefined}
									<Timestamp timestamp={evmNetworkAccount.fields.lastTransactionAt} />
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
						selector,
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
						{#if (evmNetworkAccount.fields.contractPositions?.values ?? []).length}
							<ul data-evmNetworkAccounts="unstyled">
								{#each evmNetworkAccount.fields.contractPositions?.values ?? [] as contractPosition (`${contractPosition.protocol.key}:${contractPosition.name}`)}
									<li data-column="gap-1">
										<div data-row="wrap align-baseline gap-2">
											<strong>{contractPosition.name}</strong>
											<span data-text="muted">{contractPosition.protocol.name}</span>
										</div>
										{#if contractPosition.pool != null}
											<div data-row="wrap align-center gap-2">
												<EvmContractView
													selector={{
														$network: selector.$network,
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
								No contract positions on this evmNetworkAccount.fields.
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
					|| evmNetworkAccount.current?.fields.tokenTransferCount !== undefined
					|| (evmNetworkAccount.current?.fields.$$tokenTransfers?.values.length ?? 0) > 0
				) ?
					([{ id: 'activity-token-transfers', label: 'Token transfers' }] as const)
				:
					[],
				...(
					!evmNetworkAccount.ready
					|| (evmNetworkAccount.current?.fields.$$internalTransfers?.values.length ?? 0) > 0
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
						selector,
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
						selector,
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
						selector,
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
