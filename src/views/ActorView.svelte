<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { Entity, EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { CoinInstanceType } from '$/schema/EvmCoinInstance.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/$Source.ts'
	import { caip2RouteParamsFromEvmChainId } from '$/lib/caip.ts'

	import {
		apiChainByChainId,
	} from '$/sources/Allium/Rest/constants.ts'

	import { blockscoutHostedNetworks } from '$/sources/Blockscout/Rest/constants.ts'
	import { blo } from 'blo'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	type FlattenedBalanceLine = {
		value: Entity<typeof schema, EntityType.ActorCoin>
	}


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		children,
		entityId,
		href = resolve('/account/[address]', { address: entityId.address }),
		title = 'Account',
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.Actor>
			title?: string
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Functions
	const alliumWalletBalanceChainIds = (
		Object.keys(apiChainByChainId)
			.map((key) => Number(key))
			.filter((chainId) => (
				Number.isFinite(chainId)
				&& apiChainByChainId[chainId] != null
			))
				.toSorted((a, b) => a - b)
	) satisfies readonly number[]

	const blockscoutHostedNetworkChainIds = blockscoutHostedNetworks.map((network) => network.chainId)

	const actorNetworkSliceChainIds = (
	[...new Set([
		...alliumWalletBalanceChainIds,
		...blockscoutHostedNetworkChainIds,
	])]
			.toSorted((a, b) => a - b)
	) satisfies readonly number[]

	const chainFacetLabel = (chainId: number) => (
		blockscoutHostedNetworks.find((network) => network.chainId === chainId)?.label
		?? apiChainByChainId[chainId]
		?? `Chain · ${String(chainId)}`
	)

	const portfolioSliceAtChain = (chainId: number) => {
		const index = actorNetworkSliceChainIds.indexOf(chainId)
		return index === -1 ? undefined : actorNetworkPortfolioSlices[index]
	}


	// State
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
						...(blockscoutHostedNetworkChainIds.includes(chainId) ?
							{
								$: [
									Source.Blockscout_Rest,
								],
								$$transactions: {},
								$$tokenTransfers: {},
								$$internalTransactions: {},
								isContract: {},
								transactionsCount: {},
								tokenTransferCount: {},
								firstTransactionAt: {},
								lastTransactionAt: {},
								nftCount: {},
							}
						:
							{}),
					}
				:
					{},
		)
	))

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
			const slice = actorNetworkPortfolioSlices[_index]
			const chainFacetId = actorNetworkSliceChainIds[_index]
			if (slice.ready !== true || apiChainByChainId[chainFacetId] == null) return
			for (const value of slice.current.$$ownedCoins ?? []) merged.push({
				value,
			})
		}

		for (let index = 0; index < actorNetworkPortfolioSlices.length; index += 1) pushSlice(index)

		return merged
	})

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
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
</script>


<EntityView
	entityType={EntityType.Actor}
	{entityId}
	href={href}
	{title}
	bind:open
	{...EntityViewProps}
>
	{#snippet Icon()}
		{#if true}
			{#snippet ActorIconPending()}
				<IconComponent
					alt=""
					shape={IconShape.Square}
					src={blo(entityId.address)}
					size="1.5em"
				/>
			{/snippet}

			{#snippet ActorIconBody(actor)}
				{@const avatarUrl = actor.$icon?.[EntityMetaKey.Id].url}
				<IconComponent
					alt=""
					shape={avatarUrl ? IconShape.Circle : IconShape.Square}
					src={avatarUrl ?? blo(entityId.address)}
					size="1.5em"
					title={actor.$primaryName?.[EntityMetaKey.Id].name ?? entityId.address}
				/>
			{/snippet}

			<ResourceBoundary
				Pending={ActorIconPending}
				children={ActorIconBody}
				placeholderText=""
				resource={actor}
			/>
		{/if}
	{/snippet}

	{#snippet Heading()}
		{#if true}
			{#snippet ActorHeadingBody(actor)}
				{actor.$primaryName?.[EntityMetaKey.Id].name ?? entityId.address}
			{/snippet}

			<ResourceBoundary
				children={ActorHeadingBody}
				placeholderText="Loading account…"
				resource={actor}
			/>
		{/if}
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
				&& entityId.interopAddress
			)}
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
							entityId={{
								$network: { chainId: firstContractChainId },
								address: entityId.address,
							}}
							layout={EntityLayout.SummaryDetails}
							open={true}
							showTypeAnnotation={false}
						/>
					</dd>
				</div>
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
				sectionIdPrefix={idKey}
				sections={[
					{ id: 'actor-ens', label: 'Labels' },
				]}
				{...{ 'data-card': '' }}
				class="actor-view-collapsible-identity"
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
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
					{#if true}
						{#snippet ActorEnsNamesBody(actor)}
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

						<ResourceBoundary
							children={ActorEnsNamesBody}
							placeholderText="Loading account…"
							resource={actor}
						/>
					{/if}
				{/snippet}
			</CollapsibleTabs>

			<CollapsibleTabs
				id={`${idKey}:carousel-balances`}
				sectionIdPrefix={idKey}
				sections={[
					{ id: 'balances', label: 'Balances' },
				]}
				{...{ 'data-card': '' }}
				class="actor-view-collapsible-balances"
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
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
							entityType={EntityType.ActorCoin}
							title="By deployment (all indexed networks)"
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
								href={resolve(
									'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(accounts)/account/[address]',
									{
										...caip2RouteParamsFromEvmChainId(balancesChainId),
										address: entityId.address,
									},
								)}
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
				{...{ 'data-card': '' }}
				class="actor-view-collapsible-activity"
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _summaryOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Activity</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionActivity({ id, label })}
						{#each blockscoutHostedNetworkChainIds as facetChainId (facetChainId)}
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
								layout={EntityLayout.Title}
								open={false}
							/>
							<EvmTransactionsView
								href={resolve(
									'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(accounts)/account/[address]',
									{
										...caip2RouteParamsFromEvmChainId(facetChainId),
										address: entityId.address,
									},
								)}
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
								id={`${idKey}:activity-tx-${facetChainId}`}
								title={`${chainFacetLabel(facetChainId)} · Transactions`}
							/>
							<section
								data-scroll-marker-label={`${chainFacetLabel(facetChainId)} · Token transfers`}
								id={`${idKey}:activity-net-${facetChainId}-transfers`}
							>
								<EvmTransactionsView
									href={resolve(
										'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(accounts)/account/[address]',
										{
											...caip2RouteParamsFromEvmChainId(facetChainId),
											address: entityId.address,
										},
									)}
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
									id={`${idKey}:activity-token-transfers-${facetChainId}`}
									title={`${chainFacetLabel(facetChainId)} · Token transfers`}
								/>
							</section>

							<section
								data-scroll-marker-label={`${chainFacetLabel(facetChainId)} · Internal transactions`}
								id={`${idKey}:activity-net-${facetChainId}-internal`}
							>
								<EvmTransactionsView
									href={resolve(
										'/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(accounts)/account/[address]',
										{
											...caip2RouteParamsFromEvmChainId(facetChainId),
											address: entityId.address,
										},
									)}
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
									id={`${idKey}:activity-internal-tx-${facetChainId}`}
									title={`${chainFacetLabel(facetChainId)} · Internal transactions`}
								/>
							</section>
						</section>
					{/each}
				{/snippet}
			</CollapsibleTabs>
		</div>

		{#if children}
			{@render children()}
		{/if}
	{/snippet}
</EntityView>
