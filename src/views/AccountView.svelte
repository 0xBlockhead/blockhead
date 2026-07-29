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
	}: EntitySelectionViewProps<EntityType.Account> = $props()

	const account = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
	})({
		fields: {
			namespace: true,
			address: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.Account}
	entitySelector={selection.entitySelector}
	title={title ?? (`${selection.entitySelector.caip10.namespace}:${selection.entitySelector.caip10.reference}:${selection.entitySelector.caip10.accountAddress}` || 'account')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{`${selection.entitySelector.caip10.namespace}:${selection.entitySelector.caip10.reference}:${selection.entitySelector.caip10.accountAddress}` || 'account'}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			A cross-chain account identity expressed with CAIP namespace, reference, and address fields.
		</p>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>CAIP-10</dt>
				<dd>
					<TruncatedValue value={`${selection.entitySelector.caip10.namespace}:${selection.entitySelector.caip10.reference}:${selection.entitySelector.caip10.accountAddress}`} />
				</dd>
			</div>

			<div>
				<dt>network</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$network}
					>
						{#snippet children(network)}
							<NetworkView
								selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
								prefetched={network}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Namespace</dt>
				<dd>
					<ResourceBoundary
						resource={account}
					>
						{#snippet children(entity)}
							{entity.namespace}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Address</dt>
				<dd>
					<ResourceBoundary
						resource={account}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.address} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
