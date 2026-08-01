<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.StellarTransaction_Timestamp> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import StellarTransactionView from '$/views/StellarTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.StellarTransaction_Timestamp}
	entitySelector={selection.entitySelector}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<StellarTransactionView
						selection={select(EntityType.StellarTransaction, selection.entitySelector.$transaction)}
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
							ledgerSequence: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const ledgerSequence = entity.ledgerSequence}
					{#if ledgerSequence != null}
						<div>
							<dt>ledger sequence</dt>
							<dd>
								{ledgerSequence}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							successful: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const successful = entity.successful}
					{#if successful != null}
						<div>
							<dt>successful</dt>
							<dd>
								{successful ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							resultCode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resultCode = entity.resultCode}
					{#if resultCode != null}
						<div>
							<dt>result code</dt>
							<dd>
								{resultCode}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feeCharged: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feeCharged = entity.feeCharged}
					{#if feeCharged != null}
						<div>
							<dt>fee charged</dt>
							<dd>
								{feeCharged}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxFee: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const maxFee = entity.maxFee}
					{#if maxFee != null}
						<div>
							<dt>max fee</dt>
							<dd>
								{maxFee}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							envelopeXdr: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const envelopeXdr = entity.envelopeXdr}
					{#if envelopeXdr != null}
						<div>
							<dt>envelope xdr</dt>
							<dd>
								{envelopeXdr}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							resultXdr: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resultXdr = entity.resultXdr}
					{#if resultXdr != null}
						<div>
							<dt>result xdr</dt>
							<dd>
								{resultXdr}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							metaXdr: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const metaXdr = entity.metaXdr}
					{#if metaXdr != null}
						<div>
							<dt>meta xdr</dt>
							<dd>
								{metaXdr}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feeMetaXdr: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feeMetaXdr = entity.feeMetaXdr}
					{#if feeMetaXdr != null}
						<div>
							<dt>fee meta xdr</dt>
							<dd>
								{feeMetaXdr}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>signatures</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									signatures: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.signatures.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
