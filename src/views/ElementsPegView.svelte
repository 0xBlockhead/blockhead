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
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.ElementsPeg>, 'prefetched'> = $props()

	const elementsPeg = $derived(selection({
		fields: {
			amountSats: true,
		},
	}))


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
	title={title ?? ([selection.entitySelector.direction, selection.entitySelector.pegTransactionId].filter(Boolean).join(' ') || 'Elements peg')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(elements)/elements/peg/[pegTransactionId=stringSegment]/[direction=stringSegment]',
				{
					network: (
						'caip2' in selection.entitySelector.$network.$network ?
							caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
						:
							selection.entitySelector.$network.$network.slug
					),
					pegTransactionId: selection.entitySelector.pegTransactionId,
					direction: selection.entitySelector.direction,
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
		<ResourceBoundary resource={elementsPeg}>
			{#snippet children(entity)}
				{@const amountSats = entity.amountSats}
				{#if amountSats != null}
					<NumberValue
						value={amountSats}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<ElementsNetworkView
						selection={select(EntityType.ElementsNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Direction</dt>
				<dd>
					{selection.entitySelector.direction}
				</dd>
			</div>

			<div>
				<dt>Peg transaction ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.pegTransactionId} />
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
						{@const utxoTransactionInitial = untrack(() => utxoTransaction)}
						<div>
							<dt>Bitcoin transaction</dt>
							<dd>
								<UtxoTransactionView
									selection={select(EntityType.UtxoTransaction, (utxoTransaction ?? utxoTransactionInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
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
						{@const utxoTransactionInitial = untrack(() => utxoTransaction)}
						<div>
							<dt>Elements transaction</dt>
							<dd>
								<UtxoTransactionView
									selection={select(EntityType.UtxoTransaction, (utxoTransaction ?? utxoTransactionInitial)[EntityMetaKey.Selector])}
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

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<ElementsPeg_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
