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
			selection: EntityProxyResource<typeof schema, EntityType.KaspaTransaction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.KaspaTransaction>>
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
	const kaspaTransaction = $derived(selection({
		sources: [
			Source.KaspaExplorer_Rest,
			Source.KaspaNode_Grpc,
			Source.KaspaNode_Rest,
			Source.KaspaNode_Wrpc,
		],
	}))
	const titleFallback = $derived('kaspa transaction')
	const viewDomId = $derived('kaspa-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import KaspaNetworkView from '$/views/KaspaNetworkView.svelte'
	import UtxoInputsView from '$/views/UtxoInputsView.svelte'
	import UtxoOutputsView from '$/views/UtxoOutputsView.svelte'
	import KaspaAcceptedTransactionsView from '$/views/KaspaAcceptedTransactionsView.svelte'
</script>


<EntityView
	entityType={EntityType.KaspaTransaction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={kaspaTransaction}>
			{#snippet Pending()}
				{title || 'kaspa transaction'}
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
				<dt>network</dt>
				<dd>
					<KaspaNetworkView
						selection={select(EntityType.KaspaNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>transaction ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									transactionId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const transactionId = pendingEntity.transactionId}
							{#if transactionId !== undefined && transactionId !== null}
								{String((transactionId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const transactionId = resolvedEntity.transactionId}
							{#if transactionId !== undefined && transactionId !== null}
								{String((transactionId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							version: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const version = pendingEntity.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>version</dt>
							<dd>
								{String((version) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const version = resolvedEntity.version}
					{#if version !== undefined && version !== null}
						<div>
							<dt>version</dt>
							<dd>
								{String((version) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							subnetworkId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const subnetworkId = pendingEntity.subnetworkId}
					{#if subnetworkId !== undefined && subnetworkId !== null}
						<div>
							<dt>subnetwork ID</dt>
							<dd>
								{String((subnetworkId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const subnetworkId = resolvedEntity.subnetworkId}
					{#if subnetworkId !== undefined && subnetworkId !== null}
						<div>
							<dt>subnetwork ID</dt>
							<dd>
								{String((subnetworkId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							mass: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const mass = pendingEntity.mass}
					{#if mass !== undefined && mass !== null}
						<div>
							<dt>mass</dt>
							<dd>
								<NumberValue value={Number(mass)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mass = resolvedEntity.mass}
					{#if mass !== undefined && mass !== null}
						<div>
							<dt>mass</dt>
							<dd>
								<NumberValue value={Number(mass)} />
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
							payloadLength: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const payloadLength = pendingEntity.payloadLength}
					{#if payloadLength !== undefined && payloadLength !== null}
						<div>
							<dt>payload length</dt>
							<dd>
								{String((payloadLength) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const payloadLength = resolvedEntity.payloadLength}
					{#if payloadLength !== undefined && payloadLength !== null}
						<div>
							<dt>payload length</dt>
							<dd>
								{String((payloadLength) ?? '')}
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
							selection({
								fields: {
									blockHashes: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const blockHashes = pendingEntity.blockHashes}
							{#if blockHashes !== undefined && blockHashes !== null}
								<TruncatedValue value={blockHashes.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const blockHashes = resolvedEntity.blockHashes}
							{#if blockHashes !== undefined && blockHashes !== null}
								<TruncatedValue value={blockHashes.values.map((value) => String(value ?? '')).filter(Boolean).join(', ')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Inputs and outputs</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionKaspaTxInputs({ id, label, open })}
					<UtxoInputsView
						selection={selection.$$inputs}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No UTXO inputs.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionKaspaTxOutputs({ id, label, open })}
					<UtxoOutputsView
						selection={selection.$$outputs}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No UTXO outputs.'
						open={open}
						title={label}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Acceptance</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionKaspaTxAcceptances({ id, label, open })}
					<KaspaAcceptedTransactionsView
						selection={selection.$$acceptances}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No Kaspa acceptances.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
