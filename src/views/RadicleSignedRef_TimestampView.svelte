<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.RadicleSignedRef_Timestamp>, 'prefetched'> = $props()

	const signedRef = $derived(selection.entitySelector.$signedRef)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import RadicleSignedRefView from '$/views/RadicleSignedRefView.svelte'
</script>


<EntityView
	entityType={EntityType.RadicleSignedRef_Timestamp}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/radicle/repository/[rid=stringSegment]/(radicleRepository)/signed-ref/[nodeId=stringSegment]/[refName=stringSegment]/(radicleSignedRef)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					rid: signedRef.$repository.rid,
					nodeId: signedRef.nodeId,
					refName: signedRef.refName,
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
				<dt>signed ref</dt>
				<dd>
					<RadicleSignedRefView
						selection={select(EntityType.RadicleSignedRef, selection.entitySelector.$signedRef)}
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

			<div>
				<dt>target object ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									targetObjectId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.targetObjectId}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>signature status</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									signatureStatus: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.signatureStatus}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							objectAvailable: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const objectAvailable = entity.objectAvailable}
					{#if objectAvailable != null}
						<div>
							<dt>object available</dt>
							<dd>
								{objectAvailable}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							delegateThresholdMet: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const delegateThresholdMet = entity.delegateThresholdMet}
					{#if delegateThresholdMet != null}
						<div>
							<dt>delegate threshold met</dt>
							<dd>
								{delegateThresholdMet}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>status</dt>
				<dd>
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
							{entity.status}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const error = entity.error}
					{#if error != null}
						<div>
							<dt>error</dt>
							<dd>
								{error}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
