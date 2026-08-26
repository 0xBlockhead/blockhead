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
	}: Omit<EntitySelectionViewProps<EntityType.IcpCanisterMethod_Timestamp>, 'prefetched'> = $props()

	const method = $derived(selection.entitySelector.$method)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import IcpCanisterMethodView from '$/views/IcpCanisterMethodView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpCanisterMethod_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'ICP canister method timestamp'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/method/[methodName=stringSegment]/[methodKind=stringSegment]/(icpCanisterMethod)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in method.$canister.$network.$network ?
							caip2StringFromValue(method.$canister.$network.$network.caip2)
						:
							method.$canister.$network.$network.slug
					),
					canisterId: method.$canister.canisterId,
					methodName: method.methodName,
					methodKind: method.methodKind,
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
				<dt>method</dt>
				<dd>
					<IcpCanisterMethodView
						selection={select(EntityType.IcpCanisterMethod, selection.entitySelector.$method)}
						layout={EntityLayout.Value}
					/>
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
							candidSignature: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const candidSignature = entity.candidSignature}
					{#if candidSignature != null}
						<div>
							<dt>candid signature</dt>
							<dd>
								<TruncatedValue value={candidSignature} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							certifiedResponseSupported: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const certifiedResponseSupported = entity.certifiedResponseSupported}
					{#if certifiedResponseSupported != null}
						<div>
							<dt>certified response supported</dt>
							<dd>
								{certifiedResponseSupported ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							requestCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const requestCount = entity.requestCount}
					{#if requestCount != null}
						<div>
							<dt>request count</dt>
							<dd>
								{requestCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
