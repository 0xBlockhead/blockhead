<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: Omit<EntitySelectionViewProps<EntityType.TezosEntrypoint>, 'prefetched'> = $props()

	const contract = $derived(selection.entitySelector.$contract)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TezosContractView from '$/views/TezosContractView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosEntrypoint}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/contract/tezos/[address=stringSegment]/(tezosContract)/entrypoint/[entrypointName=stringSegment]',
				{
					network: (
						'caip2' in contract.$network.$network ?
							caip2StringFromValue(contract.$network.$network.caip2)
						:
							contract.$network.$network.slug
					),
					address: contract.address,
					entrypointName: selection.entitySelector.entrypointName,
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
					<TezosContractView
						selection={select(EntityType.TezosContract, selection.entitySelector.$contract)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>entrypoint name</dt>
				<dd>
					{selection.entitySelector.entrypointName}
				</dd>
			</div>

			<div>
				<dt>annotations</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									annotations: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.annotations.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
