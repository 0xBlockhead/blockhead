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
	}: Omit<EntitySelectionViewProps<EntityType.TezosBigMapKey>, 'prefetched'> = $props()

	const bigMap = $derived(selection.entitySelector.$bigMap)


	// Components
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import TezosBigMapView from '$/views/TezosBigMapView.svelte'
</script>


<EntityView
	entityType={EntityType.TezosBigMapKey}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/contract/tezos/[address=stringSegment]/(tezosContract)/big-map/[bigMapId=nonNegativeBigInt]/(tezosBigMap)/key/[keyHash=stringSegment]',
				{
					network: (
						'caip2' in bigMap.$contract.$network.$network ?
							caip2StringFromValue(bigMap.$contract.$network.$network.caip2)
						:
							bigMap.$contract.$network.$network.slug
					),
					address: bigMap.$contract.address,
					bigMapId: String(bigMap.bigMapId),
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
				<dt>big map</dt>
				<dd>
					<TezosBigMapView
						selection={select(EntityType.TezosBigMap, selection.entitySelector.$bigMap)}
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
