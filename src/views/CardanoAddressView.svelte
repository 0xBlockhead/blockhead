<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.CardanoAddress> = $props()

	const network = $derived(selection.entitySelector.$network)
	const cardanoAddress = $derived(selection({
		sources: selection.sources ?? [
			Source.Blockfrost_Rest,
		],
	})({
		fields: {
			addressKind: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.address || 'Cardano address')
	const viewDomId = $derived('cardano-address-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import CardanoStakeCredentialView from '$/views/CardanoStakeCredentialView.svelte'
	import CardanoAddress_TimestampsView from '$/views/CardanoAddress_TimestampsView.svelte'
	import CardanoTransactionsView from '$/views/CardanoTransactionsView.svelte'
	import CardanoTxOutputsView from '$/views/CardanoTxOutputsView.svelte'
	import CardanoNativeAssetsView from '$/views/CardanoNativeAssetsView.svelte'
</script>


<EntityView
	entityType={EntityType.CardanoAddress}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
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
		{selection.entitySelector.address || 'Cardano address'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={cardanoAddress}>
			{#snippet children(entity)}
				{(entity.addressKind ?? '') || selection.entitySelector.address || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.address} />
				</dd>
			</div>

			<ResourceBoundary
				resource={cardanoAddress}
			>
				{#snippet children(entity)}
					{@const addressKind = entity.addressKind}
					{#if addressKind != null}
						<div>
							<dt>address kind</dt>
							<dd>
								{addressKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$stakeCredential}
			>
				{#snippet children(cardanoStakeCredential)}
					{#if cardanoStakeCredential != null}
						<div>
							<dt>stake credential</dt>
							<dd>
								<CardanoStakeCredentialView
									selection={select(EntityType.CardanoStakeCredential, cardanoStakeCredential[EntityMetaKey.Selector])}
									prefetched={cardanoStakeCredential}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-cardano-address-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'cardano-address-observations',
						label: 'Balance observations',
					},
					{
						id: 'cardano-address-transactions',
						label: 'Transactions',
					},
					{
						id: 'cardano-address-utxos',
						label: 'UTXOs',
					},
					{
						id: 'cardano-address-assets',
						label: 'Native assets',
					},
				]
			}
			data-card
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionCardanoAddressObservations({ id, label, open })}
				<CardanoAddress_TimestampsView
					selection={selection.$$timestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No address observations.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionCardanoAddressTransactions({ id, label, open })}
				<CardanoTransactionsView
					selection={selection.$$transactions}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No address transactions.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionCardanoAddressUtxos({ id, label, open })}
				<CardanoTxOutputsView
					selection={selection.$$utxos}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No unspent outputs.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionCardanoAddressAssets({ id, label, open })}
				<CardanoNativeAssetsView
					selection={selection.$$assets}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No native assets in current unspent outputs.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
