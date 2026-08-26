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
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.TonContractGetMethod>, 'prefetched'> = $props()


	// Components
	import TonContractView from '$/views/TonContractView.svelte'
</script>


<EntityView
	entityType={EntityType.TonContractGetMethod}
	entitySelector={selection.entitySelector}
	title={title ?? 'TON contract get method'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(accounts)/account/[accountId=stringSegmentOrPolkadotAccountIdOrEvmAddressOrSolanaPubkey]/(selection)/contract/(tonContract)/method/[methodName=stringSegment]',
				{
					network: (
						'caip2' in selection.entitySelector.$contract.$account.$network ?
							caip2StringFromValue(selection.entitySelector.$contract.$account.$network.caip2)
						:
							selection.entitySelector.$contract.$account.$network.slug
					),
					accountId: selection.entitySelector.$contract.$account.address,
					methodName: selection.entitySelector.methodName,
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
					<TonContractView
						selection={select(EntityType.TonContract, selection.entitySelector.$contract)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>method name</dt>
				<dd>
					{selection.entitySelector.methodName}
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
