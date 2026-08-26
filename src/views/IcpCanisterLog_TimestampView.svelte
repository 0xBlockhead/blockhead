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
	}: Omit<EntitySelectionViewProps<EntityType.IcpCanisterLog_Timestamp>, 'prefetched'> = $props()

	const canister = $derived(selection.entitySelector.$canister)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import IcpCanisterView from '$/views/IcpCanisterView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpCanisterLog_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'ICP canister log timestamp'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/log/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in canister.$network.$network ?
							caip2StringFromValue(canister.$network.$network.caip2)
						:
							canister.$network.$network.slug
					),
					canisterId: canister.canisterId,
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
				<dt>canister</dt>
				<dd>
					<IcpCanisterView
						selection={select(EntityType.IcpCanister, selection.entitySelector.$canister)}
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
							lastAnalyzedMessageTimeNs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastAnalyzedMessageTimeNs = entity.lastAnalyzedMessageTimeNs}
					{#if lastAnalyzedMessageTimeNs != null}
						<div>
							<dt>last analyzed message time ns</dt>
							<dd>
								{lastAnalyzedMessageTimeNs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							messageCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const messageCount = entity.messageCount}
					{#if messageCount != null}
						<div>
							<dt>message count</dt>
							<dd>
								{messageCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							logVisibility: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const logVisibility = entity.logVisibility}
					{#if logVisibility != null}
						<div>
							<dt>log visibility</dt>
							<dd>
								{logVisibility}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
