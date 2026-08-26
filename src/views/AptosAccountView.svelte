<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.AptosAccount>, 'prefetched'> = $props()

	const viewDomId = $derived('aptos-account-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AptosNetworkView from '$/views/AptosNetworkView.svelte'
	import AptosAccount_TimestampsView from '$/views/AptosAccount_TimestampsView.svelte'
	import AptosTransactionsView from '$/views/AptosTransactionsView.svelte'
	import AptosCoinBalance_TimestampsView from '$/views/AptosCoinBalance_TimestampsView.svelte'
	import AptosAccountResourcesView from '$/views/AptosAccountResourcesView.svelte'
</script>


<EntityView
	entityType={EntityType.AptosAccount}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? (selection.entitySelector.address || 'aptos account')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]',
				{
					network: (
						'caip2' in selection.entitySelector.$network.$network ?
							caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
						:
							selection.entitySelector.$network.$network.slug
					),
					accountId: selection.entitySelector.address,
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
		<TruncatedValue value={selection.entitySelector.address} />
	{/snippet}

	{#snippet Value()}
		<AptosNetworkView
			selection={select(EntityType.AptosNetwork, selection.entitySelector.$network)}
			layout={EntityLayout.Value}
		/>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<AptosNetworkView
						selection={select(EntityType.AptosNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.address} />
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-aptos-account-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'aptos-account-observations',
						label: 'Observations',
					},
					{
						id: 'aptos-account-transactions',
						label: 'Transactions',
					},
				]
			}
			data-card
			class='network-view-collapsible-account-activity'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Account activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionAptosAccountObservations({ id, label })}
				<AptosAccount_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No observations yet.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAptosAccountTransactions({ id, label })}
				<AptosTransactionsView
					selection={selection.$$transactions}
					collapsible={false}
					title={label}
					emptyText='No transactions found.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-aptos-account-resources'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'aptos-account-balances',
						label: 'Balances',
					},
					{
						id: 'aptos-account-resource-list',
						label: 'Resources',
					},
				]
			}
			data-card
			class='network-view-collapsible-resources-modules'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Resources and modules</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionAptosAccountBalances({ id, label })}
				<AptosCoinBalance_TimestampsView
					selection={selection.$$balances}
					collapsible={false}
					title={label}
					emptyText='No balances found.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAptosAccountResourceList({ id, label })}
				<AptosAccountResourcesView
					selection={selection.$$resources}
					collapsible={false}
					title={label}
					emptyText='No resources found.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
