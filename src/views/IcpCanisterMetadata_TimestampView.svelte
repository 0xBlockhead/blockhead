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
	}: Omit<EntitySelectionViewProps<EntityType.IcpCanisterMetadata_Timestamp>, 'prefetched'> = $props()

	const metadata = $derived(selection.entitySelector.$metadata)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import IcpCanisterMetadataView from '$/views/IcpCanisterMetadataView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpCanisterMetadata_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'ICP canister metadata timestamp'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/metadata/[metadataName=stringSegment]/(icpCanisterMetadata)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in metadata.$canister.$network.$network ?
							caip2StringFromValue(metadata.$canister.$network.$network.caip2)
						:
							metadata.$canister.$network.$network.slug
					),
					canisterId: metadata.$canister.canisterId,
					metadataName: metadata.metadataName,
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
				<dt>metadata</dt>
				<dd>
					<IcpCanisterMetadataView
						selection={select(EntityType.IcpCanisterMetadata, selection.entitySelector.$metadata)}
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
							visibility: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const visibility = entity.visibility}
					{#if visibility != null}
						<div>
							<dt>visibility</dt>
							<dd>
								{visibility}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							contentHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const contentHash = entity.contentHash}
					{#if contentHash != null}
						<div>
							<dt>content hash</dt>
							<dd>
								<TruncatedValue value={contentHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							contentType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const contentType = entity.contentType}
					{#if contentType != null}
						<div>
							<dt>content type</dt>
							<dd>
								{contentType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							value: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const value = entity.value}
					{#if value != null}
						<div>
							<dt>Value</dt>
							<dd>
								{value}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
