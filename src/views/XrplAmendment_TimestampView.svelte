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
	}: Omit<EntitySelectionViewProps<EntityType.XrplAmendment_Timestamp>, 'prefetched'> = $props()

	const amendment = $derived(selection.entitySelector.$amendment)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import XrplAmendmentView from '$/views/XrplAmendmentView.svelte'
</script>


<EntityView
	entityType={EntityType.XrplAmendment_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'XRPL amendment timestamp'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/amendment/[amendmentId=stringSegment]/(xrplAmendment)/observations/[ledgerIndex=nonNegativeBigInt]/[source=stringSegment]',
				{
					network: (
						'caip2' in amendment.$network ?
							caip2StringFromValue(amendment.$network.caip2)
						:
							amendment.$network.slug
					),
					amendmentId: amendment.amendmentId,
					ledgerIndex: String(selection.entitySelector.ledgerIndex),
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
