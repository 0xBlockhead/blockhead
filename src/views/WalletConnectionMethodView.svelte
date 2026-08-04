<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import {
		walletCapabilityByCapability,
		walletDependencyPolicyByDependencyPolicy,
		walletDiscoveryKindByDiscoveryKind,
		walletFormFactorByFormFactor,
		walletImplementationStatusByImplementationStatus,
		walletProtocolByProtocol,
		walletTransportKindByTransportKind,
	} from '$/constants/Wallet.ts'
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
			dependencyPolicy: true,
			formFactors: true,
			networkNamespaces: true,
			caipNamespaces: true,
			capabilities: true,
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
				{[
					walletProtocolByProtocol[entity.protocol].label,
					walletImplementationStatusByImplementationStatus[entity.implementationStatus].label,
				].join(' ') || entity.label || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<ResourceBoundary resource={walletConnectionMethod}>
			{#snippet children(entity)}
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
							{walletDiscoveryKindByDiscoveryKind[entity.discoveryKind].label}
						</dd>
					</div>

					<div>
						<dt>transport kind</dt>
						<dd>
							{walletTransportKindByTransportKind[entity.transportKind].label}
						</dd>
					</div>

					<div>
						<dt>dependency policy</dt>
						<dd>
							{walletDependencyPolicyByDependencyPolicy[entity.dependencyPolicy].label}
						</dd>
					</div>
				</dl>

				<dl data-column-item="center">
					{#if entity.formFactors.length > 0}
						<div>
							<dt>form factors</dt>
							<dd>
								{entity.formFactors.map((formFactor) => walletFormFactorByFormFactor[formFactor].label).join(', ')}
							</dd>
						</div>
					{/if}

					{#if entity.networkNamespaces.length > 0}
						<div>
							<dt>network namespaces</dt>
							<dd>
								{entity.networkNamespaces.join(', ')}
							</dd>
						</div>
					{/if}

					{#if entity.caipNamespaces.length > 0}
						<div>
							<dt>CAIP namespaces</dt>
							<dd>
								{entity.caipNamespaces.join(', ')}
							</dd>
						</div>
					{/if}

					{#if entity.capabilities.length > 0}
						<div>
							<dt>capabilities</dt>
							<dd>
								{entity.capabilities.map((capability) => walletCapabilityByCapability[capability].label).join(', ')}
							</dd>
						</div>
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
