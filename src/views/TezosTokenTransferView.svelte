<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.TezosTokenTransfer>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TezosNetworkView from '$/views/TezosNetworkView.svelte'
	import TezosTokenView from '$/views/TezosTokenView.svelte'
	import TezosAccountView from '$/views/TezosAccountView.svelte'
	import TezosOperationView from '$/views/TezosOperationView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosTokenTransfer}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/token-transfer/[transferId=stringSegment]/[source=stringSegment]',
				{
					network: (
						'caip2' in selection.entitySelector.$network.$network ?
							caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
						:
							selection.entitySelector.$network.$network.slug
					),
					transferId: selection.entitySelector.transferId,
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
				<dt>network</dt>
				<dd>
					<TezosNetworkView
						selection={select(EntityType.TezosNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>transfer ID</dt>
				<dd>
					{selection.entitySelector.transferId}
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$token}
			>
				{#snippet children(tezosToken)}
					{#if tezosToken != null}
						<div>
							<dt>token</dt>
							<dd>
								<TezosTokenView
									selection={select(EntityType.TezosToken, tezosToken[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$from}
			>
				{#snippet children(tezosAccount)}
					{#if tezosAccount != null}
						<div>
							<dt>from</dt>
							<dd>
								<TezosAccountView
									selection={select(EntityType.TezosAccount, tezosAccount[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$to}
			>
				{#snippet children(tezosAccount)}
					{#if tezosAccount != null}
						<div>
							<dt>to</dt>
							<dd>
								<TezosAccountView
									selection={select(EntityType.TezosAccount, tezosAccount[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$operation}
			>
				{#snippet children(tezosOperation)}
					{#if tezosOperation != null}
						<div>
							<dt>operation</dt>
							<dd>
								<TezosOperationView
									selection={select(EntityType.TezosOperation, tezosOperation[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							level: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const level = entity.level}
					{#if level != null}
						<div>
							<dt>level</dt>
							<dd>
								{level}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							timestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={timestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							contractAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const contractAddress = entity.contractAddress}
					{#if contractAddress != null}
						<div>
							<dt>contract address</dt>
							<dd>
								<TruncatedValue value={contractAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							tokenId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tokenId = entity.tokenId}
					{#if tokenId != null}
						<div>
							<dt>Token ID</dt>
							<dd>
								{tokenId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							amount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const amount = entity.amount}
					{#if amount != null}
						<div>
							<dt>amount</dt>
							<dd>
								{amount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							standard: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const standard = entity.standard}
					{#if standard != null}
						<div>
							<dt>standard</dt>
							<dd>
								{standard}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionId = entity.transactionId}
					{#if transactionId != null}
						<div>
							<dt>transaction ID</dt>
							<dd>
								{transactionId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
