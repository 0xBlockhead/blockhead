<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
	}: EntitySelectionViewProps<EntityType.XrplLedger> = $props()

	const network = $derived(selection.entitySelector.$network)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.XrplLedger}
	entitySelector={selection.entitySelector}
	title={title ?? 'XRPL ledger'}
	href={
		href === undefined ?
			(
				'ledgerIndex' in selection.entitySelector ?
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/ledger/[ledgerIndex=nonNegativeBigInt]',
						{
							network: (
								'caip2' in network ?
									caip2StringFromValue(network.caip2)
								:
									network.slug
							),
							ledgerIndex: String(selection.entitySelector.ledgerIndex),
						}
					)
				:
					undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
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
				<dt>ledger index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									ledgerIndex: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.ledgerIndex}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>ledger hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									ledgerHash: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.ledgerHash} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							closeTimeMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const closeTimeMs = entity.closeTimeMs}
					{#if closeTimeMs != null}
						<div>
							<dt>close time ms</dt>
							<dd>
								{closeTimeMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							validated: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const validated = entity.validated}
					{#if validated != null}
						<div>
							<dt>validated</dt>
							<dd>
								{validated ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							totalCoinsDrops: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const totalCoinsDrops = entity.totalCoinsDrops}
					{#if totalCoinsDrops != null}
						<div>
							<dt>total coins drops</dt>
							<dd>
								{totalCoinsDrops}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							parentHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const parentHash = entity.parentHash}
					{#if parentHash != null}
						<div>
							<dt>parent hash</dt>
							<dd>
								<TruncatedValue value={parentHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							accountHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const accountHash = entity.accountHash}
					{#if accountHash != null}
						<div>
							<dt>account hash</dt>
							<dd>
								<TruncatedValue value={accountHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionHash = entity.transactionHash}
					{#if transactionHash != null}
						<div>
							<dt>transaction hash</dt>
							<dd>
								<TruncatedValue value={transactionHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
