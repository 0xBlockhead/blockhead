<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.HederaAccount>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewDomId = $derived('hedera-account-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import HederaAllowancesView from '$/views/HederaAllowancesView.svelte'
	import HederaTokenAssociationsView from '$/views/HederaTokenAssociationsView.svelte'
	import HederaNftsView from '$/views/HederaNftsView.svelte'
	import HederaTransactionsView from '$/views/HederaTransactionsView.svelte'
	import HederaAccount_TimestampsView from '$/views/HederaAccount_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaAccount}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? (selection.entitySelector.accountId || 'hedera account')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=polkadotAccountIdOrStringSegmentOrEvmAddressOrSolanaPubkey]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					accountId: selection.entitySelector.accountId,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
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
				<dt>account ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.accountId} />
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-hedera-account-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'hedera-account-allowances',
						label: 'Allowances',
					},
					{
						id: 'hedera-account-tokens',
						label: 'Tokens',
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

			{#snippet SectionHederaAccountAllowances({ id, label })}
				<HederaAllowancesView
					selection={selection.$$allowances}
					collapsible={false}
					title={label}
					emptyText='No allowances.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionHederaAccountTokens({ id, label })}
				<HederaTokenAssociationsView
					selection={selection.$$tokens}
					collapsible={false}
					title={label}
					emptyText='No tokens.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-hedera-account-related'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'hedera-account-nfts',
						label: 'NFTs',
					},
					{
						id: 'hedera-account-transactions',
						label: 'Transactions',
					},
				]
			}
			data-card
			class='network-view-collapsible-related'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Related</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionHederaAccountNfts({ id, label })}
				<HederaNftsView
					selection={selection.$$nfts}
					collapsible={false}
					title={label}
					emptyText='No NFTs.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionHederaAccountTransactions({ id, label })}
				<HederaTransactionsView
					selection={selection.$$transactions}
					collapsible={false}
					title={label}
					emptyText='No transactions.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-hedera-account-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'hedera-account-timestamps',
						label: 'Timestamps',
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

			{#snippet SectionHederaAccountTimestamps({ id, label })}
				<HederaAccount_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No timestamps.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
