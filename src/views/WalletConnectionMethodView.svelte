<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.WalletConnectionMethod> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const walletConnectionMethod = $derived(viewSelection({
		fields: {
			label: true,
			protocol: true,
			discoveryKind: true,
			transportKind: true,
			implementationStatus: true,
		},
	}))
	const titleFallback = $derived((prefetched.label ?? '') || 'wallet connection method')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.WalletConnectionMethod}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={walletConnectionMethod}>
			{#snippet children(entity)}
				{entity.label || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={walletConnectionMethod}>
			{#snippet children(entity)}
				{[entity.protocol, entity.implementationStatus].filter(Boolean).join(' ') || entity.label || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					{selection.entitySelector.id}
				</dd>
			</div>

			<div>
				<dt>protocol</dt>
				<dd>
					<ResourceBoundary
						resource={walletConnectionMethod}
					>
						{#snippet children(entity)}
							{entity.protocol}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>discovery kind</dt>
				<dd>
					<ResourceBoundary
						resource={walletConnectionMethod}
					>
						{#snippet children(entity)}
							{entity.discoveryKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>transport kind</dt>
				<dd>
					<ResourceBoundary
						resource={walletConnectionMethod}
					>
						{#snippet children(entity)}
							{entity.transportKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>implementation status</dt>
				<dd>
					<ResourceBoundary
						resource={walletConnectionMethod}
					>
						{#snippet children(entity)}
							{entity.implementationStatus}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>dependency policy</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									dependencyPolicy: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.dependencyPolicy}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							apiSurfaceKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const apiSurfaceKind = entity.apiSurfaceKind}
					{#if apiSurfaceKind != null}
						<div>
							<dt>API surface kind</dt>
							<dd>
								{apiSurfaceKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							sessionKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sessionKind = entity.sessionKind}
					{#if sessionKind != null}
						<div>
							<dt>session kind</dt>
							<dd>
								{sessionKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							authorizationKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const authorizationKind = entity.authorizationKind}
					{#if authorizationKind != null}
						<div>
							<dt>authorization kind</dt>
							<dd>
								{authorizationKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							accountExposureKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const accountExposureKind = entity.accountExposureKind}
					{#if accountExposureKind != null}
						<div>
							<dt>account exposure kind</dt>
							<dd>
								{accountExposureKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							requestExecutionKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const requestExecutionKind = entity.requestExecutionKind}
					{#if requestExecutionKind != null}
						<div>
							<dt>request execution kind</dt>
							<dd>
								{requestExecutionKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							discoveryTrustKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const discoveryTrustKind = entity.discoveryTrustKind}
					{#if discoveryTrustKind != null}
						<div>
							<dt>discovery trust kind</dt>
							<dd>
								{discoveryTrustKind}
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
							viewSelection({
								fields: {
									formFactors: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.formFactors.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>network namespaces</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									networkNamespaces: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.networkNamespaces.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>CAIP namespaces</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									caipNamespaces: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.caipNamespaces.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>capabilities</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									capabilities: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.capabilities.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							sourceCapabilities: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceCapabilities = entity.sourceCapabilities}
					{#if sourceCapabilities != null}
						<div>
							<dt>source capabilities</dt>
							<dd>
								{sourceCapabilities.join(', ')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							runtimeCapabilities: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const runtimeCapabilities = entity.runtimeCapabilities}
					{#if runtimeCapabilities != null}
						<div>
							<dt>runtime capabilities</dt>
							<dd>
								{runtimeCapabilities.join(', ')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
