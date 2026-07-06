<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.LensNetwork>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.LensNetwork>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const lensNetwork = $derived(selection({
		sources: [
			Source.Constants_Internal,
		],
		fields: {
			protocolName: true,
			relationshipModel: true,
			homeUrl: true,
			docsUrl: true,
			registryName: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.protocolName) ?? '')].filter(Boolean).join(' ') || 'Lens')
	const viewDomId = $derived('lens-network-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.LensNetwork}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={lensNetwork}>
			{#snippet Pending()}
				{[String((prefetched.protocolName) ?? '')].filter(Boolean).join(' ') || title || 'Lens'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.protocolName) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={lensNetwork}>
			{#snippet Pending()}
				{[String((prefetched.protocolName) ?? '')].filter(Boolean).join(' ') || title || 'Lens'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.protocolName) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Lens is a social graph protocol. This hub shows bounded account and post windows from the declared Lens GraphQL source.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Protocol</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									protocolName: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const protocolName = prefetched.protocolName}
							{#if protocolName !== undefined && protocolName !== null}
								{String((protocolName) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const protocolName = resolvedEntity.protocolName}
							{#if protocolName !== undefined && protocolName !== null}
								{String((protocolName) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							relationshipModel: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const relationshipModel = prefetched.relationshipModel}
					{#if relationshipModel !== undefined && relationshipModel !== null}
						<div>
							<dt>Relationship model</dt>
							<dd>
								{String((relationshipModel) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const relationshipModel = resolvedEntity.relationshipModel}
					{#if relationshipModel !== undefined && relationshipModel !== null}
						<div>
							<dt>Relationship model</dt>
							<dd>
								{String((relationshipModel) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							registryName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const registryName = prefetched.registryName}
					{#if registryName !== undefined && registryName !== null}
						<div>
							<dt>Registry name</dt>
							<dd>
								{String((registryName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const registryName = resolvedEntity.registryName}
					{#if registryName !== undefined && registryName !== null}
						<div>
							<dt>Registry name</dt>
							<dd>
								{String((registryName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Home URL</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									homeUrl: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const homeUrl = prefetched.homeUrl}
							{#if homeUrl !== undefined && homeUrl !== null}
								<svelte:element
									this={'a'}
									href={String(homeUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(homeUrl)} />
								</svelte:element>
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const homeUrl = resolvedEntity.homeUrl}
							{#if homeUrl !== undefined && homeUrl !== null}
								<svelte:element
									this={'a'}
									href={String(homeUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(homeUrl)} />
								</svelte:element>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							docsUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const docsUrl = prefetched.docsUrl}
					{#if docsUrl !== undefined && docsUrl !== null}
						<div>
							<dt>Docs URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(docsUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(docsUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const docsUrl = resolvedEntity.docsUrl}
					{#if docsUrl !== undefined && docsUrl !== null}
						<div>
							<dt>Docs URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(docsUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(docsUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
