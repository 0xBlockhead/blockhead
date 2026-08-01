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
	}: EntitySelectionViewProps<EntityType.XrplAmendment_Timestamp> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import XrplAmendmentView from '$/views/XrplAmendmentView.svelte'
</script>


<EntityView
	entityType={EntityType.XrplAmendment_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'XRPL amendment timestamp'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>amendment</dt>
				<dd>
					<XrplAmendmentView
						selection={select(EntityType.XrplAmendment, selection.entitySelector.$amendment)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>ledger index</dt>
				<dd>
					{selection.entitySelector.ledgerIndex}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							enabled: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const enabled = entity.enabled}
					{#if enabled != null}
						<div>
							<dt>enabled</dt>
							<dd>
								{enabled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							supported: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const supported = entity.supported}
					{#if supported != null}
						<div>
							<dt>supported</dt>
							<dd>
								{supported ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
							enabledAtLedger: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const enabledAtLedger = entity.enabledAtLedger}
					{#if enabledAtLedger != null}
						<div>
							<dt>enabled AT ledger</dt>
							<dd>
								{enabledAtLedger}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
