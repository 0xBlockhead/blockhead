<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.FinancialProtocol_Amm_EvmBlock>, 'prefetched'> = $props()

	const financialProtocolAmmEvmBlockLatestResource1 = $derived(
		selection
			.$block({
				sources: [
					Source.TheGraph_Graphql,
				],
				fields: {
					blockNumber: true,
					timestamp: true,
				},
			})
	)

	const protocol = $derived(selection.entitySelector.$protocol)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.TheGraph_Graphql,
		],
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import FinancialProtocolView from '$/views/FinancialProtocolView.svelte'
</script>


<EntityView
	entityType={EntityType.FinancialProtocol_Amm_EvmBlock}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.sourceRevision || 'AMM protocol financial observation')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/financial-protocol/[protocolKey=stringSegment]/(financialProtocol)/amm-observation/[blockSelector=stringSegment]/[sourceRevision=stringSegment]',
				{
					network: (
						protocol.$network.caip2 !== undefined ?
							caip2StringFromValue(protocol.$network.caip2)
						:
							protocol.$network.slug
					),
					protocolKey: protocol.protocolKey,
					blockSelector: String(stringify(selection.entitySelector.$block)),
					sourceRevision: selection.entitySelector.sourceRevision,
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
		<EvmBlockView
			selection={select(EntityType.EvmBlock, selection.entitySelector.$block)}
			href={null}
			layout={EntityLayout.Title}
		/>
		{selection.entitySelector.sourceRevision}
	{/snippet}

	{#snippet Value()}
		<FinancialProtocolView
			selection={select(EntityType.FinancialProtocol, selection.entitySelector.$protocol)}
			href={null}
			layout={EntityLayout.Value}
		/>

		<EvmBlockView
			selection={select(EntityType.EvmBlock, selection.entitySelector.$block)}
			href={null}
			layout={EntityLayout.Value}
		/>
		{selection.entitySelector.sourceRevision}
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Block</dt>
				<dd>
					<ResourceBoundary
						resource={financialProtocolAmmEvmBlockLatestResource1}
					>
						{#snippet children(evmBlock)}
							{#if evmBlock != null}
								{@const evmBlockSelector = evmBlock[EntityMetaKey.Selector]}
								<EvmBlockView
									selection={
										select(EntityType.EvmBlock, evmBlockSelector, {
											sources: [
												Source.TheGraph_Graphql,
											],
										})
									}
									prefetched={{ ...evmBlockSelector, ...evmBlock }}
									layout={EntityLayout.Value}
								/>
							{:else}
								<p data-text="muted" data-section-state="resolved-empty">No block available.</p>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Total value locked (USD)</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									totalValueLockedUSD: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.totalValueLockedUSD}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Cumulative volume (USD)</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									cumulativeVolumeUSD: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.cumulativeVolumeUSD}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Cumulative supply-side revenue (USD)</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									cumulativeSupplySideRevenueUSD: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.cumulativeSupplySideRevenueUSD}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Cumulative protocol-side revenue (USD)</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									cumulativeProtocolSideRevenueUSD: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.cumulativeProtocolSideRevenueUSD}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Cumulative total revenue (USD)</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									cumulativeTotalRevenueUSD: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.cumulativeTotalRevenueUSD}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Pool count</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									totalPoolCount: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.totalPoolCount}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source protocol identifier</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									sourceEntityId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.sourceEntityId}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Expected manifest schema version</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									expectedManifestSchemaVersion: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.expectedManifestSchemaVersion}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Deployed schema version</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									reportedSchemaVersion: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.reportedSchemaVersion}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Implementation version</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									implementationVersion: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.implementationVersion}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Methodology version</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									methodologyVersion: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.methodologyVersion}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
