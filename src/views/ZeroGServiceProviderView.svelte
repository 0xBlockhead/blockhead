<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.ZeroGServiceProvider> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.ZeroGStorageNode_JsonRpc,
			Source.ZeroGStorageScan_Rest,
		],
	}))
	const zeroGServiceProvider = $derived(viewSelection({
		fields: {
			serviceKind: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.providerId ?? '') || 'zero g service provider')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import ZeroGServiceRequestsView from '$/views/ZeroGServiceRequestsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.ZeroGServiceProvider}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.providerId ?? '') || 'zero g service provider'}
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={zeroGServiceProvider}>
			{#snippet children(entity)}
				{(entity.serviceKind ?? '') || pendingEntity.providerId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NetworkView
				selection={select(EntityType.Network, selection.entitySelector.$network)}
				layout={EntityLayout.Title}
				open={false}
			/>
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>provider ID</dt>
				<dd>
					{pendingEntity.providerId}
				</dd>
			</div>

			<ResourceBoundary
				resource={zeroGServiceProvider}
			>
				{#snippet children(entity)}
					{@const serviceKind = entity.serviceKind}
					{#if serviceKind != null}
						<div>
							<dt>service kind</dt>
							<dd>
								{serviceKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$operator}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>operator</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							verificationMethod: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const verificationMethod = entity.verificationMethod}
					{#if verificationMethod != null}
						<div>
							<dt>verification method</dt>
							<dd>
								{verificationMethod}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const zeroGServiceProviderZeroGServiceRequestsViewRequestsResource = selection.$$requests}
		<ResourceBoundary
			resource={zeroGServiceProviderZeroGServiceRequestsViewRequestsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<ZeroGServiceRequestsView
						selection={zeroGServiceProviderZeroGServiceRequestsViewRequestsResource}
						countResource={zeroGServiceProviderZeroGServiceRequestsViewRequestsResource.count}
						title='requests'
						id='requests'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
