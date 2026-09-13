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
	}: Omit<EntitySelectionViewProps<EntityType.IcpSubnetCanisterRange_Timestamp>, 'prefetched'> = $props()

	const subnet = $derived(selection.entitySelector.$subnet)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import IcpSubnetView from '$/views/IcpSubnetView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpSubnetCanisterRange_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'ICP subnet canister range timestamp'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/subnet/[subnetId=stringSegment]/(icpSubnet)/canister-range/[rangeStart=stringSegment]/[rangeEnd=stringSegment]/[registryVersion=nonNegativeBigInt]/[source=stringSegment]',
				{
					network: (
						subnet.$network.$network.caip2 !== undefined ?
							caip2StringFromValue(subnet.$network.$network.caip2)
						:
							subnet.$network.$network.slug
					),
					subnetId: subnet.subnetId,
					rangeStart: selection.entitySelector.rangeStart,
					rangeEnd: selection.entitySelector.rangeEnd,
					registryVersion: String(selection.entitySelector.registryVersion),
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
				<dt>subnet</dt>
				<dd>
					<IcpSubnetView
						selection={select(EntityType.IcpSubnet, selection.entitySelector.$subnet)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>range start</dt>
				<dd>
					{selection.entitySelector.rangeStart}
				</dd>
			</div>

			<div>
				<dt>range end</dt>
				<dd>
					{selection.entitySelector.rangeEnd}
				</dd>
			</div>

			<div>
				<dt>registry version</dt>
				<dd>
					{selection.entitySelector.registryVersion}
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
							timestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={timestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
