<!-- Generated from APP.ts. -->

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
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.ZeroGServiceProvider>, 'prefetched'> = $props()

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
	const titleFallback = $derived(selection.entitySelector.providerId || 'zero g service provider')


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
	{#snippet Value()}
		<ResourceBoundary resource={zeroGServiceProvider}>
			{#snippet children(entity)}
				{(entity.serviceKind ?? '') || selection.entitySelector.providerId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NetworkView
				selection={select(EntityType.Network, selection.entitySelector.$network)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>provider ID</dt>
				<dd>
					{selection.entitySelector.providerId}
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
									layout={EntityLayout.Value}
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

	{#snippet Details()}
		{@const requestsResource = selection.$$requests}
		<ResourceBoundary
			resource={requestsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<ZeroGServiceRequestsView
						selection={requestsResource}
						countResource={requestsResource.count}
						title='requests'
						id='requests'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
