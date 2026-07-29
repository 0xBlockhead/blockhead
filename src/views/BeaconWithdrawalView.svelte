<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
	}: EntitySelectionViewProps<EntityType.BeaconWithdrawal> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Beacon_Rest,
		],
	}))
	const beaconWithdrawal = $derived(viewSelection({
		fields: {
			amountGwei: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BeaconValidatorView from '$/views/BeaconValidatorView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconWithdrawal}
	entitySelector={selection.entitySelector}
	title={title ?? `Withdrawal #${selection.entitySelector.indexInSlot}`}
	idDragPlainText={String(selection.entitySelector.indexInSlot)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/withdrawal/[index=nonNegativeInteger]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					slot: String(selection.entitySelector.slot),
					index: String(selection.entitySelector.indexInSlot),
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
		<span data-row="inline align-center gap-2 wrap">
			<span>Withdrawal </span>
			<span data-badge="small">
				#{selection.entitySelector.indexInSlot}
			</span>
		</span>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={beaconWithdrawal}>
			{#snippet children(entity)}
				{@const amountGwei = entity.amountGwei}
				{#if amountGwei != null}
					<NumberValue
						value={amountGwei}
					/>

					<span> gwei</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<span>Slot </span>
			<NumberValue
				value={selection.entitySelector.slot}
			/>
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Index in slot</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.indexInSlot}
					/>
				</dd>
			</div>

			<div>
				<dt>Slot</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.slot}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							validatorIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const validatorIndex = entity.validatorIndex}
					{#if validatorIndex != null}
						<div>
							<dt>Validator index</dt>
							<dd>
								<NumberValue
									value={validatorIndex}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={beaconWithdrawal}
			>
				{#snippet children(entity)}
					{@const amountGwei = entity.amountGwei}
					{#if amountGwei != null}
						<div>
							<dt>Amount</dt>
							<dd>
								<NumberValue
									value={amountGwei}
								/>

								<span> gwei</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$validator}
			>
				{#snippet children(beaconValidator)}
					{#if beaconValidator != null}
						<div>
							<dt>Validator</dt>
							<dd>
								<BeaconValidatorView
									selection={select(EntityType.BeaconValidator, beaconValidator[EntityMetaKey.Selector])}
									prefetched={beaconValidator}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$account}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>Account</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
