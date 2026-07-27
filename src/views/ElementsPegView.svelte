<!-- Generated from APP.ts. Do not edit by hand. -->

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
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.ElementsPeg> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const elementsPeg = $derived(selection({
		fields: {
			amountSats: true,
		},
	}))
	const titleFallback = $derived([(pendingEntity.direction ?? ''), (pendingEntity.pegTransactionId ?? '')].filter(Boolean).join(' ') || 'Elements peg')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import ElementsPeg_TimestampsView from '$/views/ElementsPeg_TimestampsView.svelte'
	import ElementsNetworkView from '$/views/ElementsNetworkView.svelte'
	import UtxoTransactionView from '$/views/UtxoTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.ElementsPeg}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{[(pendingEntity.direction ?? ''), (pendingEntity.pegTransactionId ?? '')].filter(Boolean).join(' ') || 'Elements peg'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={elementsPeg}>
			{#snippet children(entity)}
				{@const amountSats0 = entity.amountSats}
				{#if amountSats0 != null}
					<NumberValue
						value={amountSats0}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<ElementsNetworkView
						selection={select(EntityType.ElementsNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Direction</dt>
				<dd>
					{pendingEntity.direction}
				</dd>
			</div>

			<div>
				<dt>Peg transaction ID</dt>
				<dd>
					<TruncatedValue value={pendingEntity.pegTransactionId} />
				</dd>
			</div>

			<ResourceBoundary
				resource={elementsPeg}
			>
				{#snippet children(entity)}
					{@const amountSats = entity.amountSats}
					{#if amountSats != null}
						<div>
							<dt>Amount sats</dt>
							<dd>
								<NumberValue
									value={amountSats}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$bitcoinTransaction}
			>
				{#snippet children(utxoTransaction)}
					{#if utxoTransaction != null}
						<div>
							<dt>Bitcoin transaction</dt>
							<dd>
								<UtxoTransactionView
									selection={select(EntityType.UtxoTransaction, utxoTransaction[EntityMetaKey.Selector])}
									prefetched={utxoTransaction}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$elementsTransaction}
			>
				{#snippet children(utxoTransaction)}
					{#if utxoTransaction != null}
						<div>
							<dt>Elements transaction</dt>
							<dd>
								<UtxoTransactionView
									selection={select(EntityType.UtxoTransaction, utxoTransaction[EntityMetaKey.Selector])}
									prefetched={utxoTransaction}
									layout={EntityLayout.Value}
									open={false}
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
							claimScript: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const claimScript = entity.claimScript}
					{#if claimScript != null}
						<div>
							<dt>Claim script</dt>
							<dd>
								<TruncatedValue value={claimScript} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							pakProof: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const pakProof = entity.pakProof}
					{#if pakProof != null}
						<div>
							<dt>PAK proof</dt>
							<dd>
								<TruncatedValue value={pakProof} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const elementsPegElementsPegTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={elementsPegElementsPegTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<ElementsPeg_TimestampsView
						selection={elementsPegElementsPegTimestampsViewTimestampsResource}
						countResource={elementsPegElementsPegTimestampsViewTimestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
