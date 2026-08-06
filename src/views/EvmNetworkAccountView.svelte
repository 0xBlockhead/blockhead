<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.EvmNetworkAccount>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewDomId = $derived('evm-network-account-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import EvmTokenTransfersView from '$/views/EvmTokenTransfersView.svelte'
	import EvmInternalTransfersView from '$/views/EvmInternalTransfersView.svelte'
	import EvmNetworkActorCoinBalancesView from '$/views/EvmNetworkActorCoinBalancesView.svelte'
	import EvmNftsView from '$/views/EvmNftsView.svelte'
	import EvmActorCoinAllowancesView from '$/views/EvmActorCoinAllowancesView.svelte'
	import EvmNetworkAccount_TimestampsView from '$/views/EvmNetworkAccount_TimestampsView.svelte'
	import AaveReservePositionsView from '$/views/AaveReservePositionsView.svelte'
	import CompoundPositionsView from '$/views/CompoundPositionsView.svelte'
	import EulerEvkVaultPositionsView from '$/views/EulerEvkVaultPositionsView.svelte'
	import GmxPositionsView from '$/views/GmxPositionsView.svelte'
	import MorphoMarketPositionsView from '$/views/MorphoMarketPositionsView.svelte'
	import MorphoVaultPositionsView from '$/views/MorphoVaultPositionsView.svelte'
	import PendlePositionsView from '$/views/PendlePositionsView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetworkAccount}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? 'EVM network account'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					accountId: selection.entitySelector.$actor.address,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<EvmAccountView
			selection={select(EntityType.EvmAccount, selection.entitySelector.$actor)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<NetworkView
			selection={select(EntityType.Network, selection.entitySelector.$network)}
			href={null}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>actor</dt>
				<dd>
					<EvmAccountView
						selection={select(EntityType.EvmAccount, selection.entitySelector.$actor)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-evm-network-account-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'evm-network-account-transactions',
						label: 'Transactions',
					},
					{
						id: 'evm-network-account-queued-transactions',
						label: 'Queued transactions',
					},
					{
						id: 'evm-network-account-token-transfers',
						label: 'Token transfers',
					},
					{
						id: 'evm-network-account-internal-transfers',
						label: 'Internal transfers',
					},
				]
			}
			data-card
			class='network-view-collapsible-activity'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionEvmNetworkAccountTransactions({ id, label })}
				<EvmTransactionsView
					selection={selection.$$transactions}
					collapsible={false}
					title={label}
					emptyText='No transactions yet.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionEvmNetworkAccountQueuedTransactions({ id, label })}
				<EvmTransactionsView
					selection={selection.$$queuedTransactions}
					collapsible={false}
					title={label}
					emptyText='No queued Safe transactions.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionEvmNetworkAccountTokenTransfers({ id, label })}
				<EvmTokenTransfersView
					selection={selection.$$tokenTransfers}
					collapsible={false}
					title={label}
					emptyText='No token transfers yet.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionEvmNetworkAccountInternalTransfers({ id, label })}
				<EvmInternalTransfersView
					selection={selection.$$internalTransfers}
					collapsible={false}
					title={label}
					emptyText='No internal transfers yet.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-evm-network-account-balances'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'evm-network-account-owned-coins',
						label: 'Owned coins',
					},
					{
						id: 'evm-network-account-nfts',
						label: 'NFTs',
					},
					{
						id: 'evm-network-account-allowances',
						label: 'Allowances',
					},
				]
			}
			data-card
			class='network-view-collapsible-balances'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Balances and allowances</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionEvmNetworkAccountOwnedCoins({ id, label })}
				<EvmNetworkActorCoinBalancesView
					selection={selection.$$ownedCoins}
					collapsible={false}
					title={label}
					emptyText='No owned coins yet.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionEvmNetworkAccountNfts({ id, label })}
				<EvmNftsView
					selection={selection.$$nfts}
					collapsible={false}
					title={label}
					emptyText='No NFTs.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionEvmNetworkAccountAllowances({ id, label })}
				<EvmActorCoinAllowancesView
					selection={selection.$$erc20TokenAllowances}
					collapsible={false}
					title={label}
					emptyText='No allowances yet.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-evm-network-account-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'evm-network-account-timestamps',
						label: 'Observations',
					},
				]
			}
			data-card
			class='network-view-collapsible-observations'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionEvmNetworkAccountTimestamps({ id, label })}
				<EvmNetworkAccount_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No account observations yet.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-evm-network-account-defi-positions'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'evm-network-account-aave-reserve-positions',
						label: 'Aave',
					},
					{
						id: 'evm-network-account-compound-positions',
						label: 'Compound',
					},
					{
						id: 'evm-network-account-euler-evk-vault-positions',
						label: 'Euler',
					},
					{
						id: 'evm-network-account-gmx-positions',
						label: 'GMX',
					},
					{
						id: 'evm-network-account-morpho-market-positions',
						label: 'Morpho markets',
					},
					{
						id: 'evm-network-account-morpho-vault-positions',
						label: 'Morpho vaults',
					},
					{
						id: 'evm-network-account-pendle-positions',
						label: 'Pendle',
					},
				]
			}
			data-card
			class='network-view-collapsible-defi-positions'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>DeFi positions</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionEvmNetworkAccountAaveReservePositions({ id, label })}
				<AaveReservePositionsView
					selection={
						selection
						.$$aaveReservePositions({
							sources: [
								Source.Aave_Rest,
							],
							limit: 32,
						})
					}
					collapsible={false}
					title={label}
					emptyText='No Aave reserve positions.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionEvmNetworkAccountCompoundPositions({ id, label })}
				<CompoundPositionsView
					selection={
						selection
						.$$compoundPositions({
							sources: [
								Source.Compound_Rest,
							],
							limit: 32,
						})
					}
					collapsible={false}
					title={label}
					emptyText='No Compound positions.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionEvmNetworkAccountEulerEvkVaultPositions({ id, label })}
				<EulerEvkVaultPositionsView
					selection={
						selection
						.$$eulerEvkVaultPositions({
							sources: [
								Source.Euler_Rest,
							],
							limit: 32,
						})
					}
					collapsible={false}
					title={label}
					emptyText='No Euler vault positions.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionEvmNetworkAccountGmxPositions({ id, label })}
				<GmxPositionsView
					selection={
						selection
						.$$gmxPositions({
							sources: [
								Source.Gmx_Rest,
							],
							limit: 32,
						})
					}
					collapsible={false}
					title={label}
					emptyText='No GMX positions.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionEvmNetworkAccountMorphoMarketPositions({ id, label })}
				<MorphoMarketPositionsView
					selection={
						selection
						.$$morphoMarketPositions({
							sources: [
								Source.Morpho_Graphql,
							],
							limit: 32,
						})
					}
					collapsible={false}
					title={label}
					emptyText='No Morpho market positions.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionEvmNetworkAccountMorphoVaultPositions({ id, label })}
				<MorphoVaultPositionsView
					selection={
						selection
						.$$morphoVaultPositions({
							sources: [
								Source.Morpho_Graphql,
							],
							limit: 32,
						})
					}
					collapsible={false}
					title={label}
					emptyText='No Morpho vault positions.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionEvmNetworkAccountPendlePositions({ id, label })}
				<PendlePositionsView
					selection={
						selection
						.$$pendlePositions({
							sources: [
								Source.Pendle_Rest,
							],
							limit: 32,
						})
					}
					collapsible={false}
					title={label}
					emptyText='No Pendle positions.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
