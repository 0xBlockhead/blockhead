<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.KaspaTransaction> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.KaspaExplorer,
			Source.KaspaNode_Grpc,
			Source.KaspaNode_Rest,
			Source.KaspaNode_Wrpc,
		],
	}))
	const viewDomId = $derived('kaspa-transaction-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import KaspaNetworkView from '$/views/KaspaNetworkView.svelte'
	import UtxoInputsView from '$/views/UtxoInputsView.svelte'
	import UtxoOutputsView from '$/views/UtxoOutputsView.svelte'
</script>


<EntityView
	entityType={EntityType.KaspaTransaction}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<KaspaNetworkView
						selection={select(EntityType.KaspaNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>transaction ID</dt>
				<dd>
					{selection.entitySelector.transactionId}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							version: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const version = entity.version}
					{#if version != null}
						<div>
							<dt>version</dt>
							<dd>
								{version}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							subnetworkId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const subnetworkId = entity.subnetworkId}
					{#if subnetworkId != null}
						<div>
							<dt>subnetwork ID</dt>
							<dd>
								{subnetworkId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							mass: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const mass = entity.mass}
					{#if mass != null}
						<div>
							<dt>mass</dt>
							<dd>
								<NumberValue
									value={mass}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							payloadLength: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const payloadLength = entity.payloadLength}
					{#if payloadLength != null}
						<div>
							<dt>payload length</dt>
							<dd>
								{payloadLength}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>block hashes</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									blockHashes: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.blockHashes.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-kaspa-tx-io'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'kaspa-tx-inputs',
						label: 'Inputs',
					},
					{
						id: 'kaspa-tx-outputs',
						label: 'Outputs',
					},
				]
			}
			data-card
			class='network-view-collapsible-io'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Inputs and outputs</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionKaspaTxInputs({ id, label })}
				<UtxoInputsView
					selection={selection.$$inputs}
					collapsible={false}
					title={label}
					emptyText='No UTXO inputs.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionKaspaTxOutputs({ id, label })}
				<UtxoOutputsView
					selection={selection.$$outputs}
					collapsible={false}
					title={label}
					emptyText='No UTXO outputs.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-kaspa-tx-acceptance'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'kaspa-tx-acceptances',
						label: 'Acceptances',
					},
				]
			}
			data-card
			class='network-view-collapsible-acceptance'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Acceptance</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionKaspaTxAcceptances({ id, label })}
				<EntitiesList
					entityType={EntityType.KaspaAcceptedTransaction}
					collapsible={false}
					title={label}
					emptyText='No Kaspa acceptances.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$acceptances()}
				>
					{#snippet Item({ item: kaspaAcceptedTransaction })}
						<EntityView
							entityType={EntityType.KaspaAcceptedTransaction}
							entitySelector={kaspaAcceptedTransaction[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
