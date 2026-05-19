<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { Entity, EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { CoinInstanceType } from '$/schema/CoinInstance.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/$Source.ts'
	import {
		apiChainByChainId,
	} from '$/sources/Allium/Rest/constants.ts'
	import {
		blockscoutExplorerRestV2SupportedForChain,
		blockscoutHostedNetworks,
	} from '$/sources/Blockscout/Rest/constants.ts'


	const alliumWalletBalanceChainIds = (
		Object.keys(apiChainByChainId)
			.map((key) => Number(key))
			.filter((chainId) => (
				Number.isFinite(chainId)
				&& apiChainByChainId[chainId] != null
			))
			.toSorted((a, b) => a - b)
	) satisfies readonly number[]

	const blockscoutWalletActivityChainIds = (
		blockscoutHostedNetworks
			.map((network) => network.chainId)
			.filter((chainId) => blockscoutExplorerRestV2SupportedForChain(chainId))
			.toSorted((a, b) => a - b)
	) satisfies readonly number[]

	const actorNetworkSliceChainIds = (
		[...new Set([
			...alliumWalletBalanceChainIds,
			...blockscoutWalletActivityChainIds,
		])]
			.toSorted((a, b) => a - b)
	) satisfies readonly number[]


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		title = 'Account',
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.Actor>
			title?: string
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'HeadingAfter'
		>
	> = $props()


	const chainFacetLabel = (chainId: number) => (
		blockscoutHostedNetworks.find((network) => network.chainId === chainId)?.label
		?? apiChainByChainId[chainId]
		?? `Chain · ${String(chainId)}`
	)


	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'


	const actorNetworkPortfolioSlices = actorNetworkSliceChainIds.map((chainId) => (
		useEntity(
			EntityType.ActorNetwork,
			{
				$network: { chainId },
				$actor: entityId,
			},
			open ?
				{
					...(apiChainByChainId[chainId] != null ?
						{
							$$ownedCoins: {
								$: [
									Source.Allium_Rest,
								],
							},
						}
					:
						{}),
					...(blockscoutExplorerRestV2SupportedForChain(chainId) ?
						{
							$$transactions: {
								$: [
									Source.Blockscout_Rest,
								],
							},
						}
					:
						{}),
				}
			:
				{},
		)
	))

	const portfolioSliceAtChain = (chainId: number) => {
		const index = actorNetworkSliceChainIds.indexOf(chainId)
		return index === -1 ? undefined : actorNetworkPortfolioSlices[index]
	}

	const flattenedCoinItems = $derived.by(() => {
		const merged: {
			value: Entity<typeof schema, EntityType.ActorCoin>
		}[] = []

		const pushSlice = (_index: number) => {
			const sliceRow = actorNetworkPortfolioSlices[_index]
			const chainFacetId = actorNetworkSliceChainIds[_index]
			if (sliceRow.ready !== true || apiChainByChainId[chainFacetId] == null) return
			for (const value of sliceRow.current.$$ownedCoins ?? []) merged.push({
				value,
			})
		}

		for (let index = 0; index < actorNetworkPortfolioSlices.length; index += 1) pushSlice(index)

		return (
			merged.toSorted((a, b) => (
				stringify(a.value[EntityMetaKey.Id]).localeCompare(stringify(b.value[EntityMetaKey.Id]))
			))
		)
	})

	type FlattenedBalanceLine = {
		value: Entity<typeof schema, EntityType.ActorCoin>
	}

	const balanceLinesByAssetKey = $derived.by(() => {
		const groups = new Map<string, FlattenedBalanceLine[]>()
		for (const line of flattenedCoinItems) {
			const row = line.value
			const assetKey = (
				'symbol' in row
				&& typeof row.symbol === 'string'
				&& row.symbol !== '' ?
					row.symbol
				:
					stringify(row[EntityMetaKey.Id])
			)
			const bucket = groups.get(assetKey)
			if (bucket != null) bucket.push(line)
			else groups.set(assetKey, [line])
		}
		return (
			[...groups.entries()]
				.toSorted(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
		)
	})

	const idKey = stringify(entityId)

	const actor = useEntity(
		EntityType.Actor,
		entityId,
		{
			$: [
				Source.Voltaire_JsonRpc,
				...(open ?
					[Source.TheGraph_Graphql]
				:
					[]
				),
			],
			$primaryName: {
				$: [
					Source.Voltaire_JsonRpc,
				],
			},
			$icon: {
				$: [
					Source.Voltaire_JsonRpc,
				],
			},
			...(open ?
				{
					$$ensNamesOwned: {
						$: [
							Source.TheGraph_Graphql,
						],
					},
				}
			:
				{}),
		},
	)


	const pathNativeCoin = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import BalancesView from '$/views/BalancesView.svelte'
	import ActorCoinView from '$/views/ActorCoinView.svelte'
	import Address, { AddressFormat } from '$/views/Address.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import NumberValue from '$/views/NumberValue.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
</script>


<EntityView
	entityType={EntityType.Actor}
	{entityId}
	{title}
	{href}
	bind:open
	{...entityViewRest}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={actor}
			placeholderText=""
		>
			{#snippet children(actor)}
				{#if actor.$icon}
					<IconComponent
						alt={actor.$primaryName?.[EntityMetaKey.Id].name ?? entityId.address}
						shape={IconShape.Circle}
						src={actor.$icon[EntityMetaKey.Id].url}
						size="1.5em"
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={actor}
			placeholderText="Loading account…"
		>
			{#snippet children(actor)}
				{actor.$primaryName?.[EntityMetaKey.Id].name ?? entityId.address}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Id()}
		<Address
			address={entityId.address}
			format={AddressFormat.MiddleTruncated}
			showAvatar={false}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<Tooltip contentProps={{ side: 'top' }}>
			{#snippet Content()}
				<p>
					An EVM execution address: externally owned account or contract. Nothing here implies a dedicated wallet vs protocol-only role.
				</p>
				<p>
					Primary label and owned ENS names load from configured resolvers when available. Token balances aggregate Allium-covered networks; explorers power per-chain transaction timelines when REST v2 is available on the host catalog.
				</p>
			{/snippet}
			<abbr
				class="entity-heading-tip"
				aria-label="EVM address"
			>ⓘ</abbr>
		</Tooltip>
	{/snippet}

	{#snippet Content({
		title: _title,
		href: _href,
		open: contentOpen,
	})}
		<ResourceBoundary
			resource={actor}
			placeholderText="Loading account…"
		>
			{#snippet children(actor)}
				<dl data-column-item="center">
					{#if contentOpen}
						{#if entityId.interopAddress}
							<div>
								<dt>Interop address</dt>
								<dd>
									<TruncatedValue
										value={entityId.interopAddress}
										format={TruncatedValueFormat.Visual}
									/>
								</dd>
							</div>
						{/if}
					{/if}

					{#if contentOpen}
						{#if flattenedCoinItems.length}
							<div>
								<dt>Indexed balances</dt>
								<dd>{String(flattenedCoinItems.length)} token row{flattenedCoinItems.length === 1 ? '' : 's'}</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.Actor}
			{entityId}
		/>

		<div
			class="actor-view-carousel-groups"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${idKey}:carousel-identity`}
				{...{ 'data-card': '' }}
				class="actor-view-collapsible-identity"
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _identitySummary })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>Identity</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers()}
					<a
						data-scroll-marker-label="Labels"
						href={`#${idKey}:actor-ens`}
					>Labels</a>
				{/snippet}

				{#snippet children(_identityChildren)}
					<section
						data-scroll-marker-label="Labels"
						id={`${idKey}:actor-ens`}
					>
						<ResourceBoundary
							resource={actor}
							placeholderText="Loading account…"
						>
							{#snippet children(actor)}
								{#if (actor.$$ensNamesOwned ?? []).length}
									<ul data-list="unstyled">
										{#each actor.$$ensNamesOwned ?? [] as nameRef (`${nameRef[EntityMetaKey.Id].name}`)}
											<li>
												<a
													data-link
													href={resolve('/(explore)/(ens)/ens/name/[ensName]', {
														ensName: nameRef[EntityMetaKey.Id].name,
													})}
												>{nameRef[EntityMetaKey.Id].name}</a>
											</li>
										{/each}
									</ul>
								{:else}
									<div data-row="wrap align-center gap-2">
										<p data-text="muted">
											No ENS names.
										</p>
										<Tooltip contentProps={{ side: 'top' }}>
											{#snippet Content()}
												<p>
													Names owned by this address appear when subgraphs expose them from TheGraph transport.
												</p>
											{/snippet}
											<abbr
												class="entity-heading-tip"
												aria-label="ENS names"
											>ⓘ</abbr>
										</Tooltip>
									</div>
								{/if}
							{/snippet}
						</ResourceBoundary>
					</section>
				{/snippet}
			</CollapsibleTabs>

			<CollapsibleTabs
				id={`${idKey}:carousel-balances`}
				{...{ 'data-card': '' }}
				class="actor-view-collapsible-balances"
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _balancesSummary })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Balances</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers()}
					{#if flattenedCoinItems.length}
						<a
							data-scroll-marker-label="By asset"
							href={`#${idKey}:balances-by-asset`}
						>Assets</a>
						{#each balanceLinesByAssetKey as [assetKey, assetLines], coinGroupIndex (`coin-${String(coinGroupIndex)}`)}
							{#if assetLines.length}
								<a
									data-scroll-marker-label={`${assetKey} · networks`}
									href={`#${idKey}:balances-coin-${String(coinGroupIndex)}`}
								>{assetKey}</a>
							{/if}
						{/each}
						{#each alliumWalletBalanceChainIds as chainId (chainId)}
							{@const balanceSlice = portfolioSliceAtChain(chainId)}
							{#if balanceSlice?.ready === true && (balanceSlice.current.$$ownedCoins?.length ?? 0) > 0}
								{@const facetLabel = chainFacetLabel(chainId)}
								<a
									data-scroll-marker-label={`${facetLabel} balances`}
									href={`#${idKey}:balances-net-${chainId}`}
								>{facetLabel}</a>
							{/if}
						{/each}
					{/if}
				{/snippet}

				{#snippet children(_balancesChildren)}
					<section id={`${idKey}:balances-by-asset`}>
						<EntitiesList
							collapsible={false}
							entityType={EntityType.ActorCoin}
							title="By deployment (all indexed networks)"
							href={href}
							id={`${idKey}:balances-flat-list`}
							getKey={(line) => stringify(line.value[EntityMetaKey.Id])}
							getSortValue={(line) => stringify(line.value[EntityMetaKey.Id])}
							items={flattenedCoinItems}
							open={false}
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
									{@const balanceEntityId = props.item.value[EntityMetaKey.Id]}
									<ActorCoinView
										entityId={balanceEntityId}
										href={resolve('/~/(accounts)/accounts/(balances)/balance/[chainId]/[owner]/[coin]', {
											chainId: String(balanceEntityId.$coinInstance.$network.chainId),
											owner: balanceEntityId.$actor.address,
											coin: (
												balanceEntityId.$coinInstance.type === CoinInstanceType.Erc20Token ?
													balanceEntityId.$coinInstance.$contract.address
												:
													pathNativeCoin
											),
										})}
										layout={EntityLayout.Summary}
										open={false}
									/>
								{/if}
							{/snippet}
						</EntitiesList>
					</section>

					{#each balanceLinesByAssetKey as [assetKey, assetLines], coinGroupIndex (`coin-${String(coinGroupIndex)}`)}
						{#if assetLines.length}
							<section
								data-scroll-marker-label={`${assetKey} balances`}
								id={`${idKey}:balances-coin-${String(coinGroupIndex)}`}
							>
								<EntitiesList
									collapsible={false}
									entityType={EntityType.ActorCoin}
									title={`${assetKey} · by network`}
									href={href}
									id={`${idKey}:balances-coin-list-${String(coinGroupIndex)}`}
									getKey={(line) => stringify(line.value[EntityMetaKey.Id])}
									getSortValue={(line) => stringify(line.value[EntityMetaKey.Id])}
									items={assetLines}
									open={false}
									UnorderedListProps={{
										orientation: ListOrientation.Column,
									}}
								>
									{#snippet Empty()}
										<p data-text="muted">
											No rows for this symbol.
										</p>
									{/snippet}
									{#snippet Item(props)}
										{#if props.item}
											{@const balanceEntityId = props.item.value[EntityMetaKey.Id]}
											<ActorCoinView
												entityId={balanceEntityId}
												href={resolve('/~/(accounts)/accounts/(balances)/balance/[chainId]/[owner]/[coin]', {
													chainId: String(balanceEntityId.$coinInstance.$network.chainId),
													owner: balanceEntityId.$actor.address,
													coin: (
														balanceEntityId.$coinInstance.type === CoinInstanceType.Erc20Token ?
															balanceEntityId.$coinInstance.$contract.address
														:
															pathNativeCoin
													),
												})}
												layout={EntityLayout.Summary}
												open={false}
											/>
										{/if}
									{/snippet}
								</EntitiesList>
							</section>
						{/if}
					{/each}

					{#each alliumWalletBalanceChainIds as balancesChainId (balancesChainId)}
						<section
							data-scroll-marker-label={`${chainFacetLabel(balancesChainId)} balances`}
							id={`${idKey}:balances-net-${balancesChainId}`}
						>
							<BalancesView
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.ActorNetwork,
									entityId: {
										$network: {
											chainId: balancesChainId,
										},
										$actor: entityId,
									},
									fieldName: '$$ownedCoins',
								}}
								href={href}
								id={`${idKey}:balances-per-net-${balancesChainId}`}
								open={false}
								title={chainFacetLabel(balancesChainId)}
							/>
						</section>
					{/each}
				{/snippet}
			</CollapsibleTabs>

			{#if blockscoutWalletActivityChainIds.length}
				<CollapsibleTabs
					id={`${idKey}:carousel-activity`}
					{...{ 'data-card': '' }}
					class="actor-view-collapsible-activity"
					scrollContainerProps={{
						'data-row': 'start align-start',
					}}
				>
					{#snippet Summary({ open: _activitySummary })}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Activity</HeadingComponent>
						</header>
					{/snippet}

					{#snippet Markers()}
						{#each blockscoutWalletActivityChainIds as facetChainId (facetChainId)}
							{@const activityLabel = chainFacetLabel(facetChainId)}
							<a
								data-scroll-marker-label={`${activityLabel} activity`}
								href={`#${idKey}:activity-net-${facetChainId}`}
							>{activityLabel}</a>
						{/each}
					{/snippet}

					{#snippet children(_activityChildren)}
						{#each blockscoutWalletActivityChainIds as facetChainId (facetChainId)}
							{@const actorNetwork = portfolioSliceAtChain(facetChainId)}
							<section
								data-scroll-marker-label={`${chainFacetLabel(facetChainId)} activity`}
								id={`${idKey}:activity-net-${facetChainId}`}
							>
								{#if actorNetwork}
									<ResourceBoundary
										resource={actorNetwork}
										placeholderText="Loading activity summary…"
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
											{/if}
										{/snippet}
									</ResourceBoundary>
								{/if}

								<EvmTransactionsView
									collapsible={false}
									entityFieldReference={{
										entityType: EntityType.ActorNetwork,
										entityId: {
											$network: {
												chainId: facetChainId,
											},
											$actor: entityId,
										},
										fieldName: '$$transactions',
									}}
									href={href}
									id={`${idKey}:activity-tx-${facetChainId}`}
									open={false}
									title={`${chainFacetLabel(facetChainId)} · Transactions`}
								/>

								<div data-row="wrap align-center gap-2">
									<span data-text="annotation">Events</span>
									<Tooltip contentProps={{ side: 'top' }}>
										{#snippet Content()}
											<p>Open a transaction above for receipt log lines available from the indexer or node.</p>
										{/snippet}
										<abbr
											class="entity-heading-tip"
											aria-label="Event logs"
										>ⓘ</abbr>
									</Tooltip>
								</div>
							</section>
						{/each}
					{/snippet}
				</CollapsibleTabs>
			{/if}
		</div>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>


<style>
	.actor-view-carousel-groups :global(.carousel) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 40ch;
			}
		}
	}
</style>
