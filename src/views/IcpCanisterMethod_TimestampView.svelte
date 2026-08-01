<!-- Generated from APP.ts. -->

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
