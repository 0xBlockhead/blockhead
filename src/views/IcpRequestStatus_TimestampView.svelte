<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.IcpRequestStatus_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'ICP request status timestamp'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import IcpRequestStatusView from '$/views/IcpRequestStatusView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpRequestStatus_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		ICP request status timestamp
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>request status</dt>
				<dd>
					<IcpRequestStatusView
						selection={select(EntityType.IcpRequestStatus, selection.entitySelector.$requestStatus)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={Number(pendingEntity.timestampMs)} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{pendingEntity.source}
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
								{String(rejectCode)}
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
								{String(certifiedAtMs)}
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
