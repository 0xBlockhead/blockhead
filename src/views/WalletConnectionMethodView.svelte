<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import {
		walletDependencyPolicyByDependencyPolicy,
		walletDiscoveryKindByDiscoveryKind,
		walletImplementationStatusByImplementationStatus,
		walletProtocolByProtocol,
		walletTransportKindByTransportKind,
	} from '$/constants/Wallet.ts'
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
	href={
		href === undefined ?
			resolve(
				'/~/wallet/connection-method/[id=stringSegment]',
				{
					id: selection.entitySelector.id,
				}
			)
		:
			href ?? undefined
	}
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
				{[(walletProtocolByProtocol[entity.protocol]?.label ?? entity.protocol), (walletImplementationStatusByImplementationStatus[entity.implementationStatus]?.label ?? entity.implementationStatus)].filter(Boolean).join(' ') || entity.label || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>ID</dt>
				<dd>
					{selection.entitySelector.id}
				</dd>
			</div>

			<div>
				<dt>discovery kind</dt>
				<dd>
					<ResourceBoundary
						resource={walletConnectionMethod}
					>
						{#snippet children(entity)}
							{walletDiscoveryKindByDiscoveryKind[entity.discoveryKind]?.label ?? entity.discoveryKind}
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
							{walletTransportKindByTransportKind[entity.transportKind]?.label ?? entity.transportKind}
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
							{walletDependencyPolicyByDependencyPolicy[entity.dependencyPolicy]?.label ?? entity.dependencyPolicy}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
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
		</dl>
	{/snippet}
</EntityView>
