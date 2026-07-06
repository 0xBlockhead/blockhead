<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


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
			selection: EntityProxyResource<typeof schema, EntityType.RadicleIdentityDocument>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.RadicleIdentityDocument>>
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
	const radicleIdentityDocument = $derived(selection({}))
	const titleFallback = $derived('radicle identity document')
	const viewDomId = $derived('radicle-identity-document-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import RadicleRepositoryView from '$/views/RadicleRepositoryView.svelte'
</script>


<EntityView
	entityType={EntityType.RadicleIdentityDocument}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={radicleIdentityDocument}>
			{#snippet Pending()}
				{title || 'radicle identity document'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>rid</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									rid: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const rid = selection.entitySelector.rid ?? prefetched.rid}
							{#if rid !== undefined && rid !== null}
								{String((rid) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const rid = resolvedEntity.rid}
							{#if rid !== undefined && rid !== null}
								{String((rid) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>revision</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									revision: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const revision = selection.entitySelector.revision ?? prefetched.revision}
							{#if revision !== undefined && revision !== null}
								{String((revision) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const revision = resolvedEntity.revision}
							{#if revision !== undefined && revision !== null}
								{String((revision) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>document hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									documentHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const documentHash = prefetched.documentHash}
							{#if documentHash !== undefined && documentHash !== null}
								<TruncatedValue value={String((documentHash) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const documentHash = resolvedEntity.documentHash}
							{#if documentHash !== undefined && documentHash !== null}
								<TruncatedValue value={String((documentHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							signatureThreshold: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const signatureThreshold = prefetched.signatureThreshold}
					{#if signatureThreshold !== undefined && signatureThreshold !== null}
						<div>
							<dt>signature threshold</dt>
							<dd>
								<TruncatedValue value={String((signatureThreshold) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const signatureThreshold = resolvedEntity.signatureThreshold}
					{#if signatureThreshold !== undefined && signatureThreshold !== null}
						<div>
							<dt>signature threshold</dt>
							<dd>
								<TruncatedValue value={String((signatureThreshold) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							verifiedSignatureCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const verifiedSignatureCount = prefetched.verifiedSignatureCount}
					{#if verifiedSignatureCount !== undefined && verifiedSignatureCount !== null}
						<div>
							<dt>verified signature count</dt>
							<dd>
								<TruncatedValue value={String((verifiedSignatureCount) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const verifiedSignatureCount = resolvedEntity.verifiedSignatureCount}
					{#if verifiedSignatureCount !== undefined && verifiedSignatureCount !== null}
						<div>
							<dt>verified signature count</dt>
							<dd>
								<TruncatedValue value={String((verifiedSignatureCount) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							verificationStatus: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const verificationStatus = prefetched.verificationStatus}
					{#if verificationStatus !== undefined && verificationStatus !== null}
						<div>
							<dt>verification status</dt>
							<dd>
								{String((verificationStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const verificationStatus = resolvedEntity.verificationStatus}
					{#if verificationStatus !== undefined && verificationStatus !== null}
						<div>
							<dt>verification status</dt>
							<dd>
								{String((verificationStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.RadicleRepository, false>('$repository')}
			>
				{#snippet children(radicleRepository)}
					{#if radicleRepository != null && radicleRepository[EntityMetaKey.Selector] != null}
						<div>
							<dt>repository</dt>
							<dd>
								<RadicleRepositoryView
									selection={select(EntityType.RadicleRepository, radicleRepository[EntityMetaKey.Selector])}
									prefetched={radicleRepository}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
