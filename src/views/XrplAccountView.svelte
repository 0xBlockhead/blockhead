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
	}: Omit<EntitySelectionViewProps<EntityType.XrplAccount>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewDomId = $derived('xrpl-account-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import XrplLedgerEntriesView from '$/views/XrplLedgerEntriesView.svelte'
	import XrplTransactionsView from '$/views/XrplTransactionsView.svelte'
	import XrplTrustlinesView from '$/views/XrplTrustlinesView.svelte'
	import XrplAccount_TimestampsView from '$/views/XrplAccount_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.XrplAccount}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? (selection.entitySelector.account || 'XRPL account')}
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
					accountId: selection.entitySelector.account,
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
				<dt>account</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.account} />
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-xrpl-account-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'xrpl-account-ledger-entries',
						label: 'Ledger Entries',
					},
					{
						id: 'xrpl-account-transactions',
						label: 'Transactions',
					},
					{
						id: 'xrpl-account-trustlines',
						label: 'Trustlines',
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

			{#snippet SectionXrplAccountLedgerEntries({ id, label })}
				<XrplLedgerEntriesView
					selection={selection.$$ledgerEntries}
					collapsible={false}
					title={label}
					emptyText='No ledger entries.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionXrplAccountTransactions({ id, label })}
				<XrplTransactionsView
					selection={
						selection
						.$$transactions({
							sources: [
								Source.Xrpl_Rippled,
								Source.XrpScan_Rest,
							],
						})
					}
					collapsible={false}
					title={label}
					emptyText='No transactions.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionXrplAccountTrustlines({ id, label })}
				<XrplTrustlinesView
					selection={selection.$$trustlines}
					collapsible={false}
					title={label}
					emptyText='No trustlines.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-xrpl-account-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'xrpl-account-timestamps',
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

			{#snippet SectionXrplAccountTimestamps({ id, label })}
				<XrplAccount_TimestampsView
					selection={
						selection
						.$$timestamps({
							sources: [
								Source.Bithomp,
								Source.Xrpl_Rippled,
								Source.XrpScan_Rest,
							],
						})
					}
					collapsible={false}
					title={label}
					emptyText='No timestamps.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
