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
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.IcpRequestStatus_Timestamp>, 'prefetched'> = $props()

	const requestStatus = $derived(selection.entitySelector.$requestStatus)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import IcpRequestStatusView from '$/views/IcpRequestStatusView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpRequestStatus_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'ICP request status timestamp'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/request/[requestId=stringSegment]/(icpRequestStatus)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in requestStatus.$network.$network ?
							caip2StringFromValue(requestStatus.$network.$network.caip2)
						:
							requestStatus.$network.$network.slug
					),
					requestId: requestStatus.requestId,
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
				<dt>request status</dt>
				<dd>
					<IcpRequestStatusView
						selection={select(EntityType.IcpRequestStatus, selection.entitySelector.$requestStatus)}
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
							status: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>status</dt>
							<dd>
								{status}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							replyHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const replyHash = entity.replyHash}
					{#if replyHash != null}
						<div>
							<dt>reply hash</dt>
							<dd>
								<TruncatedValue value={replyHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rejectCode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rejectCode = entity.rejectCode}
					{#if rejectCode != null}
						<div>
							<dt>reject code</dt>
							<dd>
								{rejectCode}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rejectMessage: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const rejectMessage = entity.rejectMessage}
					{#if rejectMessage != null}
						<div>
							<dt>reject message</dt>
							<dd>
								{rejectMessage}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							certifiedAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const certifiedAtMs = entity.certifiedAtMs}
					{#if certifiedAtMs != null}
						<div>
							<dt>certified AT ms</dt>
							<dd>
								{certifiedAtMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							certificateHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const certificateHash = entity.certificateHash}
					{#if certificateHash != null}
						<div>
							<dt>certificate hash</dt>
							<dd>
								<TruncatedValue value={certificateHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
