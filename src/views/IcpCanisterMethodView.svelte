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
	}: Omit<EntitySelectionViewProps<EntityType.IcpCanisterMethod>, 'prefetched'> = $props()

	const canister = $derived(selection.entitySelector.$canister)


	// Components
	import IcpCanisterView from '$/views/IcpCanisterView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpCanisterMethod}
	entitySelector={selection.entitySelector}
	title={title ?? 'ICP canister method'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/method/[methodName=stringSegment]/[methodKind=stringSegment]',
				{
					network: (
						'caip2' in canister.$network.$network ?
							caip2StringFromValue(canister.$network.$network.caip2)
						:
							canister.$network.$network.slug
					),
					canisterId: canister.canisterId,
					methodName: selection.entitySelector.methodName,
					methodKind: selection.entitySelector.methodKind,
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
				<dt>canister</dt>
				<dd>
					<IcpCanisterView
						selection={select(EntityType.IcpCanister, selection.entitySelector.$canister)}
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

			<div>
				<dt>method kind</dt>
				<dd>
					{selection.entitySelector.methodKind}
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
