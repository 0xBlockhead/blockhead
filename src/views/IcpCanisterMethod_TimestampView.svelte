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
	}: EntitySelectionViewProps<EntityType.IcpCanisterMethod_Timestamp> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'ICP canister method timestamp'


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import IcpCanisterMethodView from '$/views/IcpCanisterMethodView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpCanisterMethod_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		ICP canister method timestamp
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>method</dt>
				<dd>
					<IcpCanisterMethodView
						selection={select(EntityType.IcpCanisterMethod, selection.entitySelector.$method)}
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
								{String(requestCount)}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
