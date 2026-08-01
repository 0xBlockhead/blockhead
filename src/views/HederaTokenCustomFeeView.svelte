<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.HederaTokenCustomFee>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import HederaToken_TimestampView from '$/views/HederaToken_TimestampView.svelte'
	import HederaAccountView from '$/views/HederaAccountView.svelte'
	import HederaTokenView from '$/views/HederaTokenView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaTokenCustomFee}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>token timestamp</dt>
				<dd>
					<HederaToken_TimestampView
						selection={select(EntityType.HederaToken_Timestamp, selection.entitySelector.$tokenTimestamp)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>fee index</dt>
				<dd>
					{selection.entitySelector.feeIndex}
				</dd>
			</div>

			<div>
				<dt>fee kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									feeKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.feeKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							collectorAccountId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const collectorAccountId = entity.collectorAccountId}
					{#if collectorAccountId != null}
						<div>
							<dt>collector account ID</dt>
							<dd>
								<TruncatedValue value={collectorAccountId} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							denominatingTokenId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const denominatingTokenId = entity.denominatingTokenId}
					{#if denominatingTokenId != null}
						<div>
							<dt>denominating token ID</dt>
							<dd>
								{denominatingTokenId}
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
							numerator: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const numerator = entity.numerator}
					{#if numerator != null}
						<div>
							<dt>numerator</dt>
							<dd>
								{numerator}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							denominator: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const denominator = entity.denominator}
					{#if denominator != null}
						<div>
							<dt>denominator</dt>
							<dd>
								{denominator}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							minimumAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const minimumAmount = entity.minimumAmount}
					{#if minimumAmount != null}
						<div>
							<dt>minimum amount</dt>
							<dd>
								{minimumAmount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maximumAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const maximumAmount = entity.maximumAmount}
					{#if maximumAmount != null}
						<div>
							<dt>maximum amount</dt>
							<dd>
								{maximumAmount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							netOfTransfers: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const netOfTransfers = entity.netOfTransfers}
					{#if netOfTransfers != null}
						<div>
							<dt>net of transfers</dt>
							<dd>
								{netOfTransfers ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							allCollectorsAreExempt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const allCollectorsAreExempt = entity.allCollectorsAreExempt}
					{#if allCollectorsAreExempt != null}
						<div>
							<dt>all collectors are exempt</dt>
							<dd>
								{allCollectorsAreExempt ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$collector}
			>
				{#snippet children(hederaAccount)}
					{#if hederaAccount != null}
						<div>
							<dt>collector</dt>
							<dd>
								<HederaAccountView
									selection={select(EntityType.HederaAccount, hederaAccount[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$denominatingToken}
			>
				{#snippet children(hederaToken)}
					{#if hederaToken != null}
						<div>
							<dt>denominating token</dt>
							<dd>
								<HederaTokenView
									selection={select(EntityType.HederaToken, hederaToken[EntityMetaKey.Selector])}
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
