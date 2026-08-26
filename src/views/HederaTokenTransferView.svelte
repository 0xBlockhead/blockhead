<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: Omit<EntitySelectionViewProps<EntityType.HederaTokenTransfer>, 'prefetched'> = $props()

	const transaction = $derived(selection.entitySelector.$transaction)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HederaTransactionView from '$/views/HederaTransactionView.svelte'
	import HederaTokenView from '$/views/HederaTokenView.svelte'
	import HederaAccountView from '$/views/HederaAccountView.svelte'
	import HederaNftView from '$/views/HederaNftView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaTokenTransfer}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			(
				'consensusTimestamp' in transaction ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(transactions)/tx/consensus/[consensusTimestamp=stringSegment]/(hederaTransaction)/token-transfer/[tokenId=stringSegment]/[accountId=stringSegment]/[transferIndex=nonNegativeInteger]',
						{
							network: (
								'caip2' in transaction.$network ?
									caip2StringFromValue(transaction.$network.caip2)
								:
									transaction.$network.slug
							),
							consensusTimestamp: transaction.consensusTimestamp,
							tokenId: selection.entitySelector.tokenId,
							accountId: selection.entitySelector.accountId,
							transferIndex: String(selection.entitySelector.transferIndex),
						}
					)
				:
					undefined
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
				<dt>transaction</dt>
				<dd>
					<HederaTransactionView
						selection={select(EntityType.HederaTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Token ID</dt>
				<dd>
					{selection.entitySelector.tokenId}
				</dd>
			</div>

			<div>
				<dt>account ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.accountId} />
				</dd>
			</div>

			<div>
				<dt>transfer index</dt>
				<dd>
					{selection.entitySelector.transferIndex}
				</dd>
			</div>

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
							serialNumber: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const serialNumber = entity.serialNumber}
					{#if serialNumber != null}
						<div>
							<dt>serial number</dt>
							<dd>
								{serialNumber}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							isApproval: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const isApproval = entity.isApproval}
					{#if isApproval != null}
						<div>
							<dt>is approval</dt>
							<dd>
								{isApproval ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$token}
			>
				{#snippet children(hederaToken)}
					{#if hederaToken != null}
						{@const hederaTokenInitial = untrack(() => hederaToken)}
						<div>
							<dt>token</dt>
							<dd>
								<HederaTokenView
									selection={select(EntityType.HederaToken, (hederaToken ?? hederaTokenInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$account}
			>
				{#snippet children(hederaAccount)}
					{#if hederaAccount != null}
						{@const hederaAccountInitial = untrack(() => hederaAccount)}
						<div>
							<dt>account</dt>
							<dd>
								<HederaAccountView
									selection={select(EntityType.HederaAccount, (hederaAccount ?? hederaAccountInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$nft}
			>
				{#snippet children(hederaNft)}
					{#if hederaNft != null}
						{@const hederaNftInitial = untrack(() => hederaNft)}
						<div>
							<dt>NFT</dt>
							<dd>
								<HederaNftView
									selection={select(EntityType.HederaNft, (hederaNft ?? hederaNftInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
