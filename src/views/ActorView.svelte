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
	import { blockscoutHostedNetworks } from '$/sources/Blockscout/Rest/constants.ts'


	const alliumWalletBalanceChainIds = (
		Object.keys(apiChainByChainId)
			.map((key) => Number(key))
			.filter((chainId) => (
				Number.isFinite(chainId)
				&& apiChainByChainId[chainId] != null
			))
			.toSorted((a, b) => a - b)
	) satisfies readonly number[]

	const actorNetworkSliceChainIds = (
		[...new Set([
			...alliumWalletBalanceChainIds,
			...blockscoutHostedNetworks.map((network) => network.chainId),
		])]
			.toSorted((a, b) => a - b)
	) satisfies readonly number[]


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children: _children,
		entityId,
		title = 'Account',
		href,
		open = $bindable(true),
		collapsible = true,
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
	import { blo } from 'blo'
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
					$: [
						Source.Blockscout_Rest,
					],
					$$transactions: {},
					$$tokenTransfers: {},
					$$internalTransactions: {},
					$$erc20TokenAllowances: {},
					isContract: {},
					transactionsCount: {},
					tokenTransferCount: {},
					firstTransactionAt: {},
					lastTransactionAt: {},
					nftCount: {},
				}
			:
				{},
		)
	))

	const portfolioSliceAtChain = (chainId: number) => {
		const index = actorNetworkSliceChainIds.indexOf(chainId)
		return index === -1 ? undefined : actorNetworkPortfolioSlices[index]
	}

	const firstContractChainId = $derived.by(() => {
		for (let index = 0; index < actorNetworkSliceChainIds.length; index += 1) {
			const chainId = actorNetworkSliceChainIds[index]
			if (portfolioSliceAtChain(chainId)?.current.isContract === true) {
				return chainId
			}
		}
		return undefined
	})

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
				row.symbol !== '' ?
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
	import Icon, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import BalancesView from '$/views/BalancesView.svelte'
	import ActorCoinView from '$/views/ActorCoinView.svelte'
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import { ListOrientation } from '$/components/ListOrientation.ts'
</script>


<EntityView
	entityType={EntityType.Actor}
	{entityId}
	{title}
	{href}
	bind:open
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet Icon()}
		<ResourceBoundary
			placeholderText=""
			resource={actor}
		>
			{#snippet Pending()}
				<Icon
					alt=""
					shape={IconShape.Square}
					src={blo(entityId.address)}
					size="1.5em"
				/>
			{/snippet}

			{#snippet children(actor)}
				{@const avatarUrl = actor.$icon?.[EntityMetaKey.Id].url}
				<Icon
					alt=""
					shape={avatarUrl ? IconShape.Circle : IconShape.Square}
					src={avatarUrl ?? blo(entityId.address)}
					size="1.5em"
					title={actor.$primaryName?.[EntityMetaKey.Id].name ?? entityId.address}
				/>
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

	{#snippet Value()}
		<TruncatedValue
			format={TruncatedValueFormat.Visual}
			value={entityId.address}
		/>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
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

			{#if contentOpen}
				{#if firstContractChainId != null}
					<div>
						<dt>Contract</dt>
						<dd>
							<EvmContractView
								entityId={{
									$network: { chainId: firstContractChainId },
									address: entityId.address,
								}}
								href={resolve(
									'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
									{
										networkId: String(firstContractChainId),
										address: entityId.address,
									},
								)}
								layout={EntityLayout.Title}
								open={false}
								showTypeAnnotation={false}
							/>
						</dd>
					</div>
				{/if}
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: detailsOpen,
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
				{#snippet Summary(_context)}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>Identity</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers(_context)}
					<a
						data-scroll-marker-label="Labels"
						href={`#${idKey}:actor-ens`}
					>Labels</a>
				{/snippet}

				{#snippet body(_identityChildren)}
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
				{#snippet Summary(_context)}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Balances</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers(_context)}
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

				{#snippet body(_balancesChildren)}
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
								title={chainFacetLabel(balancesChainId)}
							/>
						</section>
					{/each}
				{/snippet}
			</CollapsibleTabs>

			<CollapsibleTabs
				id={`${idKey}:carousel-activity`}
					{...{ 'data-card': '' }}
					class="actor-view-collapsible-activity"
					scrollContainerProps={{
						'data-row': 'start align-start',
					}}
				>
					{#snippet Summary(_context)}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>Activity</HeadingComponent>
						</header>
					{/snippet}

					{#snippet Markers(_context)}
						{#each actorNetworkSliceChainIds as facetChainId (facetChainId)}
							{@const activityLabel = chainFacetLabel(facetChainId)}
							{@const facetSlice = portfolioSliceAtChain(facetChainId)}
							<a
								data-scroll-marker-label={`${activityLabel} activity`}
								href={`#${idKey}:activity-net-${facetChainId}`}
							>{activityLabel}</a>
							{#if (
								!facetSlice?.ready
								|| facetSlice.current.tokenTransferCount !== undefined
								|| (facetSlice.current.$$tokenTransfers ?? []).length > 0
							)}
								<a
									data-scroll-marker-label={`${activityLabel} · Token transfers`}
									href={`#${idKey}:activity-net-${facetChainId}-transfers`}
								>{activityLabel} · Token transfers</a>
							{/if}
							{#if (
								!facetSlice?.ready
								|| (facetSlice.current.$$internalTransactions ?? []).length > 0
							)}
								<a
									data-scroll-marker-label={`${activityLabel} · Internal transactions`}
									href={`#${idKey}:activity-net-${facetChainId}-internal`}
								>{activityLabel} · Internal transactions</a>
							{/if}
						{/each}
					{/snippet}

					{#snippet body(_activityChildren)}
						{#each actorNetworkSliceChainIds as facetChainId (facetChainId)}
							<section
								data-scroll-marker-label={`${chainFacetLabel(facetChainId)} activity`}
								id={`${idKey}:activity-net-${facetChainId}`}
							>
								<ActorNetworkView
									entityId={{
										$network: {
											chainId: facetChainId,
										},
										$actor: entityId,
									}}
									href={resolve(
										'/(explore)/(networks)/network/[networkId]/(network)/(accounts)/account/[address]',
										{
											networkId: String(facetChainId),
											address: entityId.address,
										},
									)}
									layout={EntityLayout.Title}
									open={false}
									showTypeAnnotation={false}
								/>

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
									title={`${chainFacetLabel(facetChainId)} · Transactions`}
								/>

								<section
									data-scroll-marker-label={`${chainFacetLabel(facetChainId)} · Token transfers`}
									id={`${idKey}:activity-net-${facetChainId}-transfers`}
								>
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
											fieldName: '$$tokenTransfers',
										}}
										href={href}
										id={`${idKey}:activity-token-transfers-${facetChainId}`}
										title={`${chainFacetLabel(facetChainId)} · Token transfers`}
									/>
								</section>

								<section
									data-scroll-marker-label={`${chainFacetLabel(facetChainId)} · Internal transactions`}
									id={`${idKey}:activity-net-${facetChainId}-internal`}
								>
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
											fieldName: '$$internalTransactions',
										}}
										href={href}
										id={`${idKey}:activity-internal-tx-${facetChainId}`}
										title={`${chainFacetLabel(facetChainId)} · Internal transactions`}
									/>
								</section>
							</section>
						{/each}
					{/snippet}
				</CollapsibleTabs>
		</div>

		{#if _children}
			{@render _children()}
		{/if}
	{/snippet}
</EntityView>

