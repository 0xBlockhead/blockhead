<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { Entity, EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { Source } from '$/sources/$Source.ts'

	import {
		apiChainByChainId,
	} from '$/sources/Allium/Rest/constants.ts'

	import { blockscoutHostedNetworks } from '$/sources/Blockscout/Rest/constants.ts'
	import { blo } from 'blo'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	type FlattenedBalanceLine = {
		value: Entity<typeof schema, EntityType.EvmNetworkActorCoinBalance>
	}


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve('/account/[address]', { address: entityId.address }),
		title = 'Account',
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.EvmAccount>
			title?: string
			href?: string
			open?: boolean
			collapsible?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Functions
	const blockscoutHostedNetworkChainIds = blockscoutHostedNetworks.map((network) => network.chainId)

	const alliumWalletBalanceChainIds = (
		Object.keys(apiChainByChainId)
			.map((key) => Number(key))
			.filter((chainId) => (
				Number.isFinite(chainId)
				&& apiChainByChainId[chainId] != null
			))
				.toSorted((a, b) => a - b)
	) satisfies readonly number[]

	const evmNetworkAccountSliceChainIds = (
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
		const index = evmNetworkAccountSliceChainIds.indexOf(chainId)
		return index === -1 ? undefined : evmNetworkAccountPortfolioSlices[index]
	}


	const evmNetworkAccountPortfolioSlices = evmNetworkAccountSliceChainIds.map((chainId) => (
		useEntity(
			EntityType.EvmNetworkAccount,
			{
				$network: { caip2: { namespace: 'eip155' as const, reference: String(chainId) } },
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
							...(blockscoutHostedNetworks.some((network) => network.chainId === chainId) ?
							{
								$: [
									Source.Blockscout_Rest,
								],
								$$transactions: {},
								$$tokenTransfers: {},
								$$internalTransfers: {},
								isContract: {},
								transactionCount: {},
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
		EntityType.EvmAccount,
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


	// (Derived)
		const firstContractChainId = $derived.by(() => {
			for (let index = 0; index < evmNetworkAccountSliceChainIds.length; index += 1) {
				const chainId = evmNetworkAccountSliceChainIds[index]
				if (portfolioSliceAtChain(chainId)?.current?.isContract === true) {
					return chainId
				}
			}
		return undefined
	})

	const flattenedCoinItems = $derived.by(() => {
		const merged: {
			value: Entity<typeof schema, EntityType.EvmNetworkActorCoinBalance>
		}[] = []

		const pushSlice = (_index: number) => {
			const slice = evmNetworkAccountPortfolioSlices[_index]
			const chainFacetId = evmNetworkAccountSliceChainIds[_index]
			if (slice.ready !== true || apiChainByChainId[chainFacetId] == null) return
			for (const value of slice.current.$$ownedCoins ?? []) merged.push({
				value,
			})
		}

		for (let index = 0; index < evmNetworkAccountPortfolioSlices.length; index += 1) pushSlice(index)

		return merged
	})

	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent, { IconShape } from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import BalancesView from '$/views/BalancesView.svelte'
	import EvmNetworkActorCoinBalanceView from '$/views/EvmNetworkActorCoinBalanceView.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import EvmTokenTransfersView from '$/views/EvmTokenTransfersView.svelte'
	import EvmInternalTransfersView from '$/views/EvmInternalTransfersView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmAccount}
	{entityId}
	href={href}
	{title}
	bind:open
	{collapsible}
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
					src={blo(entityId.address)}
				/>
			{/snippet}

			{#snippet children(actor)}
				{@const avatarUrl = actor.$icon?.[EntityMetaKey.Id].url}
				<IconComponent
					alt=""
					shape={avatarUrl ? IconShape.Circle : IconShape.Square}
					src={avatarUrl ?? blo(entityId.address)}
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
					value={entityId.address}
				/>
			{/snippet}

			{#snippet children(actor)}
				{#if actor.$primaryName?.[EntityMetaKey.Id].name}
					{actor.$primaryName?.[EntityMetaKey.Id].name}
				{:else}
					<TruncatedValue
						format={TruncatedValueFormat.Visual}
						value={entityId.address}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
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
								$network: { caip2: { namespace: 'eip155' as const, reference: String(firstContractChainId) } },
								address: entityId.address,
							}}
							layout={EntityLayout.Value}
							open={true}
							showTypeAnnotation={false}
						/>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open,
	})}
		<CollapsibleTabs
			id={`${idKey}:carousel-identity`}
			sectionIdPrefix={idKey}
			sections={[
				{ id: 'actor-ens', label: 'Labels' },
			]}
			data-card
			class="actor-view-collapsible-identity"
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
					{#snippet ActorEnsNamesBody(actor: Entity<typeof schema, EntityType.EvmAccount>)}
						{#if (actor.$$ensNamesOwned ?? []).length}
							<ul data-evmAccounts="unstyled">
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
			data-card
			class="actor-view-collapsible-balances"
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
							entityType={EntityType.EvmNetworkActorCoinBalance}
							title="By deployment (all indexed networks)"
							id={`${idKey}:balances-flat-evmAccounts`}
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
										<EvmNetworkActorCoinBalanceView
											entityId={props.item.value[EntityMetaKey.Id]}
											layout={EntityLayout.Summary}
										/>
									{/if}
							{/snippet}
						</EntitiesList>
					</section>

					{#each (() => {
						const groups = new Map<string, FlattenedBalanceLine[]>()
						for (const line of flattenedCoinItems) {
							const row = line.value
							const assetKey = (
									row.symbol != null && row.symbol !== '' ?
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
					})() as [assetKey, assetLines], coinGroupIndex (`coin-${String(coinGroupIndex)}`)}
						{#if assetLines.length}
							<section
								data-scroll-marker-label={`${assetKey} balances`}
								id={`${idKey}:balances-coin-${String(coinGroupIndex)}`}
							>
								<EntitiesList
									collapsible={false}
									entityType={EntityType.EvmNetworkActorCoinBalance}
									title={`${assetKey} · by network`}
									id={`${idKey}:balances-coin-evmAccounts-${String(coinGroupIndex)}`}
									getKey={(line) => stringify(line.value[EntityMetaKey.Id])}
									getSortValue={(line) => stringify(line.value[EntityMetaKey.Id])}
									items={assetLines}
									UnorderedListProps={{
										orientation: ListOrientation.Column,
									}}
								>
									{#snippet Empty()}
										<p data-text="muted">
											No evmAccounts for this symbol.
										</p>
									{/snippet}
									{#snippet Item(props)}
										{#if props.item}
											<EvmNetworkActorCoinBalanceView
												entityId={props.item.value[EntityMetaKey.Id]}
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
								CollapsibleProps={{ canToggle: false }}
								href={resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(accounts)/account/[address]', {
										...{ caip2Namespace: 'eip155' as const, caip2Reference: `${balancesChainId}` },
										address: entityId.address,
									})}
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.EvmNetworkAccount,
									entityId: {
										$network: { caip2: { namespace: 'eip155' as const, reference: String(balancesChainId) } },
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
				data-card
				class="actor-view-collapsible-activity"
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
						<EvmNetworkAccountView
							entityId={{
								$network: { caip2: { namespace: 'eip155' as const, reference: String(facetChainId) } },
								$actor: entityId,
							}}
							layout={EntityLayout.Title}
							open={false}
						/>
						<EvmTransactionsView
							CollapsibleProps={{ canToggle: false }}
							href={resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(accounts)/account/[address]', {
									...{ caip2Namespace: 'eip155' as const, caip2Reference: `${facetChainId}` },
									address: entityId.address,
								})}
							collapsible={false}
							entityFieldReference={{
								entityType: EntityType.EvmNetworkAccount,
								entityId: {
									$network: { caip2: { namespace: 'eip155' as const, reference: String(facetChainId) } },
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
							<EvmTokenTransfersView
								CollapsibleProps={{ canToggle: false }}
								href={resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(accounts)/account/[address]', {
									...{ caip2Namespace: 'eip155' as const, caip2Reference: `${facetChainId}` },
									address: entityId.address,
								})}
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.EvmNetworkAccount,
									entityId: {
										$network: { caip2: { namespace: 'eip155' as const, reference: String(facetChainId) } },
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
							<EvmInternalTransfersView
								CollapsibleProps={{ canToggle: false }}
								href={resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]/(network)/(accounts)/account/[address]', {
									...{ caip2Namespace: 'eip155' as const, caip2Reference: `${facetChainId}` },
									address: entityId.address,
								})}
								collapsible={false}
								entityFieldReference={{
									entityType: EntityType.EvmNetworkAccount,
									entityId: {
										$network: { caip2: { namespace: 'eip155' as const, reference: String(facetChainId) } },
										$actor: entityId,
									},
									fieldName: '$$internalTransfers',
								}}
								id={`${idKey}:activity-internal-tx-${facetChainId}`}
								title={`${chainFacetLabel(facetChainId)} · Internal transactions`}
							/>
						</section>
					</section>
				{/each}
			{/snippet}
			</CollapsibleTabs>
	{/snippet}
</EntityView>
