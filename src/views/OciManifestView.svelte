<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: Omit<EntitySelectionViewProps<EntityType.OciManifest>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.OciRegistry_Distribution,
		],
	}))
	const ociManifest = $derived(viewSelection({
		fields: {
			artifactType: true,
			mediaType: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.repository || 'OCI manifest')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import OciDescriptorsView from '$/views/OciDescriptorsView.svelte'
	import OciDescriptorView from '$/views/OciDescriptorView.svelte'
</script>


<EntityView
	entityType={EntityType.OciManifest}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(social)/(oci)/oci/registry/[registry=stringSegment]/repository/[repository=stringSegment]/manifest/[reference=stringSegment]',
				{
					registry: selection.entitySelector.registry,
					repository: encodeURIComponent(selection.entitySelector.repository),
					reference: encodeURIComponent(selection.entitySelector.reference),
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
		{selection.entitySelector.reference || selection.entitySelector.repository || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={ociManifest}>
			{#snippet children(entity)}
				{@const artifactType = entity.artifactType}
				{#if artifactType != null}
					<span data-text="muted">
						{artifactType}
					</span>
				{/if}
				{@const mediaType = entity.mediaType}
				{#if mediaType != null}
					<span data-text="muted">
						{mediaType}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>registry</dt>
				<dd>
					{selection.entitySelector.registry}
				</dd>
			</div>

			<div>
				<dt>repository</dt>
				<dd>
					{selection.entitySelector.repository}
				</dd>
			</div>

			<div>
				<dt>reference</dt>
				<dd>
					{selection.entitySelector.reference}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							contentDigest: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const contentDigest = entity.contentDigest}
					{#if contentDigest != null}
						<div>
							<dt>content digest</dt>
							<dd>
								<TruncatedValue value={contentDigest} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={ociManifest}
			>
				{#snippet children(entity)}
					{@const mediaType = entity.mediaType}
					{#if mediaType != null}
						<div>
							<dt>media type</dt>
							<dd>
								{mediaType}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={ociManifest}
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

			<ResourceBoundary
				resource={selection.$config}
			>
				{#snippet children(ociDescriptor)}
					{#if ociDescriptor != null}
						{@const ociDescriptorInitial = untrack(() => ociDescriptor)}
						<div>
							<dt>config</dt>
							<dd>
								<OciDescriptorView
									selection={select(EntityType.OciDescriptor, (ociDescriptor ?? ociDescriptorInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$subject}
			>
				{#snippet children(ociDescriptor)}
					{#if ociDescriptor != null}
						{@const ociDescriptorInitial = untrack(() => ociDescriptor)}
						<div>
							<dt>subject</dt>
							<dd>
								<OciDescriptorView
									selection={select(EntityType.OciDescriptor, (ociDescriptor ?? ociDescriptorInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const layersResource = selection.$$layers}
		<ResourceBoundary
			resource={layersResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<OciDescriptorsView
						selection={layersResource}
						countResource={layersResource.count}
						title='Layers'
						id='layers'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const manifestsResource = selection.$$manifests}
		<ResourceBoundary
			resource={manifestsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<OciDescriptorsView
						selection={manifestsResource}
						countResource={manifestsResource.count}
						title='Child manifests'
						id='manifests'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const referrersResource = selection.$$referrers}
		<ResourceBoundary
			resource={referrersResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<OciDescriptorsView
						selection={referrersResource}
						countResource={referrersResource.count}
						title='Referrers'
						id='referrers'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
