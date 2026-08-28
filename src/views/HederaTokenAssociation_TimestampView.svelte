<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.HederaTokenAssociation_Timestamp>, 'prefetched'> = $props()

	const association = $derived(selection.entitySelector.$association)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import HederaTokenAssociationView from '$/views/HederaTokenAssociationView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaTokenAssociation_Timestamp}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/token/[tokenId=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in association.$account.$network ?
							caip2StringFromValue(association.$account.$network.caip2)
						:
							association.$account.$network.slug
					),
					accountId: association.$account.accountId,
					tokenId: association.$token.tokenId,
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>association</dt>
				<dd>
					<HederaTokenAssociationView
						selection={select(EntityType.HederaTokenAssociation, selection.entitySelector.$association)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							associationStatus: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const associationStatus = entity.associationStatus}
					{#if associationStatus != null}
						<div>
							<dt>association status</dt>
							<dd>
								{associationStatus}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							balance: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const balance = entity.balance}
					{#if balance != null}
						<div>
							<dt>balance</dt>
							<dd>
								{balance}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							kycStatus: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const kycStatus = entity.kycStatus}
					{#if kycStatus != null}
						<div>
							<dt>kyc status</dt>
							<dd>
								{kycStatus}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							freezeStatus: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const freezeStatus = entity.freezeStatus}
					{#if freezeStatus != null}
						<div>
							<dt>freeze status</dt>
							<dd>
								{freezeStatus}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
