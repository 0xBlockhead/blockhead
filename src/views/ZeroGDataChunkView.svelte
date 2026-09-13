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
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.ZeroGDataChunk>, 'prefetched'> = $props()

	const dataBlob = $derived(selection.entitySelector.$dataBlob)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ZeroGDataBlobView from '$/views/ZeroGDataBlobView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGDataChunk}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/data-blob/[dataRoot=stringSegment]/(zeroGDataBlob)/chunk/[chunkIndex=nonNegativeInteger]',
				{
					network: (
						dataBlob.$network.caip2 !== undefined ?
							caip2StringFromValue(dataBlob.$network.caip2)
						:
							dataBlob.$network.slug
					),
					dataRoot: dataBlob.dataRoot,
					chunkIndex: String(selection.entitySelector.chunkIndex),
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
				<dt>data blob</dt>
				<dd>
					<ZeroGDataBlobView
						selection={select(EntityType.ZeroGDataBlob, selection.entitySelector.$dataBlob)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>chunk index</dt>
				<dd>
					{selection.entitySelector.chunkIndex}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							chunkRoot: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const chunkRoot = entity.chunkRoot}
					{#if chunkRoot != null}
						<div>
							<dt>chunk root</dt>
							<dd>
								{chunkRoot}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sizeBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sizeBytes = entity.sizeBytes}
					{#if sizeBytes != null}
						<div>
							<dt>size bytes</dt>
							<dd>
								{sizeBytes}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
