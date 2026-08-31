<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadCashuMeltQuote>, 'prefetched'> = $props()


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BlockheadCashuProofsView from '$/views/BlockheadCashuProofsView.svelte'
	import BlockheadCashuMeltQuote_TimestampsView from '$/views/BlockheadCashuMeltQuote_TimestampsView.svelte'
	import CashuMintView from '$/views/CashuMintView.svelte'
	import BlockheadCashuWalletStateView from '$/views/BlockheadCashuWalletStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadCashuMeltQuote}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.quoteId || 'blockhead Cashu melt quote')}
	href={
		href === undefined ?
			resolve(
				'/cashu/mint/[mintUrl=absoluteUrl]/(cashuMint)/melt-quote/[method=stringSegment]/[quoteId=stringSegment]',
				{
					mintUrl: encodeURIComponent(selection.entitySelector.$mint.mintUrl),
					method: selection.entitySelector.method,
					quoteId: selection.entitySelector.quoteId,
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
					<NumberValue
						value={amount}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>mint</dt>
				<dd>
					<CashuMintView
						selection={select(EntityType.CashuMint, selection.entitySelector.$mint)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>method</dt>
				<dd>
					{selection.entitySelector.method}
				</dd>
			</div>

			<div>
				<dt>quote ID</dt>
				<dd>
					{selection.entitySelector.quoteId}
				</dd>
			</div>

			<div>
				<dt>request</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									request: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.request}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$walletState}
			>
				{#snippet children(blockheadCashuWalletState)}
					{#if blockheadCashuWalletState != null}
						<div>
							<dt>wallet state</dt>
							<dd>
								<BlockheadCashuWalletStateView
									selection={select(EntityType.BlockheadCashuWalletState, blockheadCashuWalletState[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							amount: true,
							unit: true,
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
								<NumberValue
									value={amount}
								/>

								<span>{entity.unit == null ? '' : ` ${entity.unit}`}</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feeReserve: true,
							unit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feeReserve = entity.feeReserve}
					{#if feeReserve != null}
						<div>
							<dt>fee reserve</dt>
							<dd>
								<NumberValue
									value={feeReserve}
								/>

								<span>{entity.unit == null ? '' : ` ${entity.unit}`}</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const inputProofsResource = selection.$$inputProofs}
		<ResourceBoundary
			resource={inputProofsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadCashuProofsView
						selection={inputProofsResource}
						countResource={inputProofsResource.count}
						title='input proofs'
						id='input-proofs'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadCashuMeltQuote_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
