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
	}: Omit<EntitySelectionViewProps<EntityType.HederaContractState_Timestamp>, 'prefetched'> = $props()

	const contract = $derived(selection.entitySelector.$contract)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import HederaContractView from '$/views/HederaContractView.svelte'
</script>


<EntityView
	entityType={EntityType.HederaContractState_Timestamp}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(contracts)/contract/[address=evmAddressOrStringSegment]/(selection)/slot/[slot=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in contract.$network ?
							caip2StringFromValue(contract.$network.caip2)
						:
							contract.$network.slug
					),
					address: contract.contractId,
					slot: selection.entitySelector.slot,
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
				<dt>contract</dt>
				<dd>
					<HederaContractView
						selection={select(EntityType.HederaContract, selection.entitySelector.$contract)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>slot</dt>
				<dd>
					{selection.entitySelector.slot}
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
							value: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const value = entity.value}
					{#if value != null}
						<div>
							<dt>Value</dt>
							<dd>
								{value}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
