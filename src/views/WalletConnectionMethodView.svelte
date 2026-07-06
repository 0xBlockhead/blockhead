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
			selection: EntityProxyResource<typeof schema, EntityType.WalletConnectionMethod>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.WalletConnectionMethod>>
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
	const walletConnectionMethod = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			label: true,
			protocol: true,
			discoveryKind: true,
			transportKind: true,
			implementationStatus: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.label) ?? '')].filter(Boolean).join(' ') || 'wallet connection method')
	const viewDomId = $derived('wallet-connection-method-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.WalletConnectionMethod}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={walletConnectionMethod}>
			{#snippet Pending()}
				{[String((prefetched.label) ?? '')].filter(Boolean).join(' ') || title || 'wallet connection method'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={walletConnectionMethod}>
			{#snippet Pending()}
				{[String((prefetched.protocol) ?? ''), String((prefetched.implementationStatus) ?? '')].filter(Boolean).join(' ') || [String((prefetched.label) ?? '')].filter(Boolean).join(' ') || title || 'wallet connection method'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.protocol) ?? ''), String((resolvedEntity.implementationStatus) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									id: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const id = selection.entitySelector.id ?? prefetched.id}
							{#if id !== undefined && id !== null}
								{String((id) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const id = resolvedEntity.id}
							{#if id !== undefined && id !== null}
								{String((id) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>protocol</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									protocol: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const protocol = prefetched.protocol}
							{#if protocol !== undefined && protocol !== null}
								{String((protocol) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const protocol = resolvedEntity.protocol}
							{#if protocol !== undefined && protocol !== null}
								{String((protocol) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>discovery kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									discoveryKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const discoveryKind = prefetched.discoveryKind}
							{#if discoveryKind !== undefined && discoveryKind !== null}
								{String((discoveryKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const discoveryKind = resolvedEntity.discoveryKind}
							{#if discoveryKind !== undefined && discoveryKind !== null}
								{String((discoveryKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>transport kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									transportKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const transportKind = prefetched.transportKind}
							{#if transportKind !== undefined && transportKind !== null}
								{String((transportKind) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const transportKind = resolvedEntity.transportKind}
							{#if transportKind !== undefined && transportKind !== null}
								{String((transportKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>implementation status</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									implementationStatus: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const implementationStatus = prefetched.implementationStatus}
							{#if implementationStatus !== undefined && implementationStatus !== null}
								{String((implementationStatus) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const implementationStatus = resolvedEntity.implementationStatus}
							{#if implementationStatus !== undefined && implementationStatus !== null}
								{String((implementationStatus) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>dependency policy</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									dependencyPolicy: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const dependencyPolicy = prefetched.dependencyPolicy}
							{#if dependencyPolicy !== undefined && dependencyPolicy !== null}
								{String((dependencyPolicy) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const dependencyPolicy = resolvedEntity.dependencyPolicy}
							{#if dependencyPolicy !== undefined && dependencyPolicy !== null}
								{String((dependencyPolicy) ?? '')}
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
							apiSurfaceKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const apiSurfaceKind = prefetched.apiSurfaceKind}
					{#if apiSurfaceKind !== undefined && apiSurfaceKind !== null}
						<div>
							<dt>API surface kind</dt>
							<dd>
								{String((apiSurfaceKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const apiSurfaceKind = resolvedEntity.apiSurfaceKind}
					{#if apiSurfaceKind !== undefined && apiSurfaceKind !== null}
						<div>
							<dt>API surface kind</dt>
							<dd>
								{String((apiSurfaceKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sessionKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sessionKind = prefetched.sessionKind}
					{#if sessionKind !== undefined && sessionKind !== null}
						<div>
							<dt>session kind</dt>
							<dd>
								{String((sessionKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sessionKind = resolvedEntity.sessionKind}
					{#if sessionKind !== undefined && sessionKind !== null}
						<div>
							<dt>session kind</dt>
							<dd>
								{String((sessionKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							authorizationKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const authorizationKind = prefetched.authorizationKind}
					{#if authorizationKind !== undefined && authorizationKind !== null}
						<div>
							<dt>authorization kind</dt>
							<dd>
								{String((authorizationKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const authorizationKind = resolvedEntity.authorizationKind}
					{#if authorizationKind !== undefined && authorizationKind !== null}
						<div>
							<dt>authorization kind</dt>
							<dd>
								{String((authorizationKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							accountExposureKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const accountExposureKind = prefetched.accountExposureKind}
					{#if accountExposureKind !== undefined && accountExposureKind !== null}
						<div>
							<dt>account exposure kind</dt>
							<dd>
								<TruncatedValue value={String((accountExposureKind) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const accountExposureKind = resolvedEntity.accountExposureKind}
					{#if accountExposureKind !== undefined && accountExposureKind !== null}
						<div>
							<dt>account exposure kind</dt>
							<dd>
								<TruncatedValue value={String((accountExposureKind) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							requestExecutionKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const requestExecutionKind = prefetched.requestExecutionKind}
					{#if requestExecutionKind !== undefined && requestExecutionKind !== null}
						<div>
							<dt>request execution kind</dt>
							<dd>
								{String((requestExecutionKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const requestExecutionKind = resolvedEntity.requestExecutionKind}
					{#if requestExecutionKind !== undefined && requestExecutionKind !== null}
						<div>
							<dt>request execution kind</dt>
							<dd>
								{String((requestExecutionKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							discoveryTrustKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const discoveryTrustKind = prefetched.discoveryTrustKind}
					{#if discoveryTrustKind !== undefined && discoveryTrustKind !== null}
						<div>
							<dt>discovery trust kind</dt>
							<dd>
								{String((discoveryTrustKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const discoveryTrustKind = resolvedEntity.discoveryTrustKind}
					{#if discoveryTrustKind !== undefined && discoveryTrustKind !== null}
						<div>
							<dt>discovery trust kind</dt>
							<dd>
								{String((discoveryTrustKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>form factors</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									formFactors: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const formFactors = prefetched.formFactors}
							{#if formFactors !== undefined && formFactors !== null}
								{formFactors == null ? '' : String(((formFactors).join(', ')) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const formFactors = resolvedEntity.formFactors}
							{#if formFactors !== undefined && formFactors !== null}
								{formFactors == null ? '' : String(((formFactors).join(', ')) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>network namespaces</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									networkNamespaces: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const networkNamespaces = prefetched.networkNamespaces}
							{#if networkNamespaces !== undefined && networkNamespaces !== null}
								{networkNamespaces == null ? '' : String(((networkNamespaces).join(', ')) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const networkNamespaces = resolvedEntity.networkNamespaces}
							{#if networkNamespaces !== undefined && networkNamespaces !== null}
								{networkNamespaces == null ? '' : String(((networkNamespaces).join(', ')) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>CAIP namespaces</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									caipNamespaces: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const caipNamespaces = prefetched.caipNamespaces}
							{#if caipNamespaces !== undefined && caipNamespaces !== null}
								{caipNamespaces == null ? '' : String(((caipNamespaces).join(', ')) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const caipNamespaces = resolvedEntity.caipNamespaces}
							{#if caipNamespaces !== undefined && caipNamespaces !== null}
								{caipNamespaces == null ? '' : String(((caipNamespaces).join(', ')) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>capabilities</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									capabilities: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const capabilities = prefetched.capabilities}
							{#if capabilities !== undefined && capabilities !== null}
								{capabilities == null ? '' : String(((capabilities).join(', ')) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const capabilities = resolvedEntity.capabilities}
							{#if capabilities !== undefined && capabilities !== null}
								{capabilities == null ? '' : String(((capabilities).join(', ')) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceCapabilities: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceCapabilities = prefetched.sourceCapabilities}
					{#if sourceCapabilities !== undefined && sourceCapabilities !== null}
						<div>
							<dt>source capabilities</dt>
							<dd>
								{sourceCapabilities == null ? '' : String(((sourceCapabilities).join(', ')) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceCapabilities = resolvedEntity.sourceCapabilities}
					{#if sourceCapabilities !== undefined && sourceCapabilities !== null}
						<div>
							<dt>source capabilities</dt>
							<dd>
								{sourceCapabilities == null ? '' : String(((sourceCapabilities).join(', ')) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							runtimeCapabilities: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const runtimeCapabilities = prefetched.runtimeCapabilities}
					{#if runtimeCapabilities !== undefined && runtimeCapabilities !== null}
						<div>
							<dt>runtime capabilities</dt>
							<dd>
								{runtimeCapabilities == null ? '' : String(((runtimeCapabilities).join(', ')) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const runtimeCapabilities = resolvedEntity.runtimeCapabilities}
					{#if runtimeCapabilities !== undefined && runtimeCapabilities !== null}
						<div>
							<dt>runtime capabilities</dt>
							<dd>
								{runtimeCapabilities == null ? '' : String(((runtimeCapabilities).join(', ')) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
