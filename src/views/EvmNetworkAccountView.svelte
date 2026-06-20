<script lang="ts">
	// Types/constants
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { ComponentProps, Snippet } from 'svelte'
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
		selection,
		href = resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(accounts)/account/[address=evmAddress]', {
			caip2: `${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`,
			address: selection.entitySelector.$actor.address,
		}),
		title = 'Network account',
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			pageContent?: Snippet
			selection: EntityProxyResource<typeof schema, EntityType.EvmNetworkAccount>
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
	import { select } from '$/routes/+layout.svelte'

	const evmNetworkAccountDetailAnchorKey = $derived(stringify(selection.entitySelector))

	const network = $derived(select(EntityType.EvmNetwork, selection.entitySelector.$network, {
		sources: [
			Source.Constants_Internal,
			Source.Chainlist_Rest,
			Source.EthereumLists_Rest,
			Source.Lifi_Rest,
		],
	}))
	const networkName = $derived(network.name)
	const networkIcon = $derived(network.$icon({
		sources: [
			Source.Constants_Internal,
			Source.Chainlist_Rest,
		],
	}))

	const actor = $derived(select(EntityType.EvmAccount, selection.entitySelector.$actor, {
		sources: [Source.Voltaire_JsonRpc],
	}))
	const primaryName = $derived(actor.$primaryName)
	const actorIcon = $derived(actor.$icon)

	const isZeroGNetworkAccount = $derived(
		selection.entitySelector.$network.caip2.namespace === 'eip155'
		&& selection.entitySelector.$network.caip2.reference === '16661',
	)
	const evmNetworkAccount = $derived(selection( {
		sources: isZeroGNetworkAccount ?
			[Source.ZeroGChain_JsonRpc]
		:
			[Source.Blockscout_Rest],
		fields: isZeroGNetworkAccount ?
			{ isContract: true }
		:
			{
				transactionCount: true,
				tokenTransferCount: true,
				isContract: true,
				nftCount: true,
				firstTransactionAt: true,
				lastTransactionAt: true,
				contractPositions: true,
			},
	}))
	const ownedCoins = $derived(
		isZeroGNetworkAccount ?
			undefined
		:
			evmNetworkAccount.$$ownedCoins({
				sources: [Source.Allium_Rest],
			}),
	)
	const isContract = $derived(evmNetworkAccount.isContract)
	const transactions = $derived(evmNetworkAccount.$$transactions)
	const tokenTransfers = $derived(evmNetworkAccount.$$tokenTransfers)
	const internalTransfers = $derived(evmNetworkAccount.$$internalTransfers)
	const transactionCount = $derived(evmNetworkAccount.transactionCount)
	const tokenTransferCount = $derived(evmNetworkAccount.tokenTransferCount)
	const firstTransactionAt = $derived(evmNetworkAccount.firstTransactionAt)
	const lastTransactionAt = $derived(evmNetworkAccount.lastTransactionAt)
	const nftCount = $derived(evmNetworkAccount.nftCount)
	const contractPositions = $derived(evmNetworkAccount.contractPositions)


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
	entitySelector={selection.entitySelector}
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
					src={blo(selection.entitySelector.$actor.address)}
				/>
			{/snippet}

			{#snippet children(actor)}
				{@const avatarUrl = actor.$icon?.entitySelector.url}
				<IconComponent
					alt=""
					shape={avatarUrl ? IconShape.Circle : IconShape.Square}
					src={avatarUrl ?? blo(selection.entitySelector.$actor.address)}
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
					value={selection.entitySelector.$actor.address}
				/>
			{/snippet}

			{#snippet children(actor)}
				{#if actor.$primaryName?.entitySelector.name}
					{actor.$primaryName?.entitySelector.name}
				{:else}
					<TruncatedValue
						format={TruncatedValueFormat.Visual}
						value={selection.entitySelector.$actor.address}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		<TruncatedValue
			format={TruncatedValueFormat.Visual}
			value={selection.entitySelector.$actor.address}
		/>

		<small data-row="inline align-center wrap" data-text="muted">
			on
			<ResourceBoundary
				resource={network}
				placeholderText="···"
			>
				{#snippet children(network)}
					<EvmNetworkView
						selection={select(EntityType.EvmNetwork, selection.entitySelector.$network)}
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
							value={selection.entitySelector.$actor.address}
						/>
					</dd>
				</div>
			{/if}
			{#if contentOpen}
				<div>
					<dt>CAIP-2</dt>
					<dd data-text="mono">
						<code>eip155:{String(evmChainIdFromCaip2(`${selection.entitySelector.$network.caip2.namespace}:${selection.entitySelector.$network.caip2.reference}`))}</code>
					</dd>
				</div>
			{/if}
			{#if contentOpen}
				<div>
					<dt>Network</dt>
					<dd>
						<EvmNetworkView
							selection={select(EntityType.EvmNetwork, selection.entitySelector.$network)}
							layout={EntityLayout.Value}

							open={false}
							/>
					</dd>
				</div>
			{/if}
			{#if contentOpen && !isZeroGNetworkAccount}
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
										selection={select(EntityType.EvmContract, {
											$network: selection.entitySelector.$network,
											address: selection.entitySelector.$actor.address,
										})}
										layout={EntityLayout.Value}
										showTypeAnnotation={false}
										open={false}
										/>
								</dd>
							</div>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/if}
			{#if contentOpen && !isZeroGNetworkAccount}
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
			{#if contentOpen && !isZeroGNetworkAccount}
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
			{#if contentOpen && !isZeroGNetworkAccount}
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
			{#if contentOpen && !isZeroGNetworkAccount}
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
		{#if !isZeroGNetworkAccount}
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
						selection={selection.$$ownedCoins}
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
							{#if evmNetworkAccount.contractPositions.values.length}
								<ul data-evmNetworkAccounts="unstyled">
									{#each evmNetworkAccount.contractPositions.values as contractPosition (`${contractPosition.protocol.key}:${contractPosition.name}`)}
										<li data-column="gap-1">
											<div data-row="wrap align-baseline gap-2">
												<strong>{contractPosition.name}</strong>
												<span data-text="muted">{contractPosition.protocol.name}</span>
											</div>
											{#if contractPosition.pool != null}
												<div data-row="wrap align-center gap-2">
													<EvmContractView
														selection={select(EntityType.EvmContract, {
															$network: selection.entitySelector.$network,
															address: contractPosition.pool.address,
														})}
														layout={EntityLayout.Title}
														open={false}
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
		{/if}

		{#if !isZeroGNetworkAccount}
			<CollapsibleTabs
				id={`${evmNetworkAccountDetailAnchorKey}:carousel-activity`}
				sectionIdPrefix={evmNetworkAccountDetailAnchorKey}
				sections={[
					{ id: 'activity-transactions', label: 'Transactions' },
					{ id: 'activity-token-transfers', label: 'Token transfers' },
					{ id: 'activity-internal-transfers', label: 'Internal transfers' },
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
							selection={evmNetworkAccount.$$transactions({
							sources: [Source.Blockscout_Rest],
							limit: 32,
						})}
						id={`${evmNetworkAccountDetailAnchorKey}:activity-tx`}
					/>
				{/snippet}

				{#snippet SectionActivityTokenTransfers({ id: _tokenTransfersId, label: _tokenTransfersLabel })}
					<EvmTokenTransfersView
						CollapsibleProps={{ canToggle: false }}
						href={href}
						collapsible={false}
						selection={selection.$$tokenTransfers}
						id={`${evmNetworkAccountDetailAnchorKey}:activity-token-tx-transfers`}
						title="Token transfers"
					/>
				{/snippet}

				{#snippet SectionActivityInternalTransfers({ id: _internalTransfersId, label: _internalTransfersLabel })}
					<EvmInternalTransfersView
						CollapsibleProps={{ canToggle: false }}
						href={href}
						collapsible={false}
						selection={selection.$$internalTransfers}
						id={`${evmNetworkAccountDetailAnchorKey}:activity-internal-tx`}
						title="Internal transfers"
					/>
				{/snippet}
			</CollapsibleTabs>
		{/if}

		{#if pageContent}
			{@render pageContent()}
		{/if}
	{/snippet}
</EntityView>
