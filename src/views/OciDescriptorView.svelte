<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.OciDescriptor>, 'prefetched'> = $props()

	const manifest = $derived(selection.entitySelector.$manifest)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.OciRegistry_Distribution,
		],
	}))
	const ociDescriptor = $derived(viewSelection({
		fields: {
			digest: true,
			sizeBytes: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import OciManifestView from '$/views/OciManifestView.svelte'
</script>


<EntityView
	entityType={EntityType.OciDescriptor}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.descriptorKind || 'OCI descriptor')}
	href={
		href === undefined ?
			resolve(
				'/(social)/(oci)/oci/registry/[registry=stringSegment]/repository/[repository=stringSegment]/manifest/[reference=stringSegment]/(ociManifest)/descriptor/[descriptorKind=stringSegment]/[descriptorIndex=nonNegativeInteger]',
				{
					registry: manifest.registry,
					repository: encodeURIComponent(manifest.repository),
					reference: encodeURIComponent(manifest.reference),
					descriptorKind: selection.entitySelector.descriptorKind,
					descriptorIndex: String(selection.entitySelector.descriptorIndex),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={ociDescriptor}>
			{#snippet children(entity)}
				<TruncatedValue value={entity.digest} />
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={ociDescriptor}>
			{#snippet children(entity)}
				<span data-text="muted">
					<NumberValue
						value={entity.sizeBytes}
					/>
				</span>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>manifest</dt>
				<dd>
					<OciManifestView
						selection={select(EntityType.OciManifest, selection.entitySelector.$manifest)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>descriptor kind</dt>
				<dd>
					{selection.entitySelector.descriptorKind}
				</dd>
			</div>

			<div>
				<dt>descriptor index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.descriptorIndex}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>media type</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									mediaType: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.mediaType}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>digest</dt>
				<dd>
					<ResourceBoundary
						resource={ociDescriptor}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.digest} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>size</dt>
				<dd>
					<ResourceBoundary
						resource={ociDescriptor}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.sizeBytes}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							artifactType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const artifactType = entity.artifactType}
					{#if artifactType != null}
						<div>
							<dt>artifact type</dt>
							<dd>
								{artifactType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>URLs</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									urls: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.urls.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
