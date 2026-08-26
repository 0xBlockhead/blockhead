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
	}: Omit<EntitySelectionViewProps<EntityType.SorobanContractStorageEntry>, 'prefetched'> = $props()

	const contract = $derived(selection.entitySelector.$contract)


	// Components
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SorobanContractView from '$/views/SorobanContractView.svelte'
</script>


<EntityView
	entityType={EntityType.SorobanContractStorageEntry}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/soroban/contract/[contractId=stringSegment]/(sorobanContract)/storage/[keyHash=stringSegment]',
				{
					network: (
						'caip2' in contract.$network.$network ?
							caip2StringFromValue(contract.$network.$network.caip2)
						:
							contract.$network.$network.slug
					),
					contractId: contract.contractId,
					keyHash: selection.entitySelector.keyHash,
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
					<SorobanContractView
						selection={select(EntityType.SorobanContract, selection.entitySelector.$contract)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>key hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.keyHash} />
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
