<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.SorobanContract_Timestamp>, 'prefetched'> = $props()

	const contract = $derived(selection.entitySelector.$contract)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import SorobanContractView from '$/views/SorobanContractView.svelte'
	import SorobanWasmView from '$/views/SorobanWasmView.svelte'
</script>


<EntityView
	entityType={EntityType.SorobanContract_Timestamp}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/soroban/contract/[contractId=stringSegment]/(sorobanContract)/ledger/[ledgerSequence=nonNegativeBigInt]/[source=stringSegment]',
				{
					network: (
						'caip2' in contract.$network.$network ?
							caip2StringFromValue(contract.$network.$network.caip2)
						:
							contract.$network.$network.slug
					),
					contractId: contract.contractId,
					ledgerSequence: String(selection.entitySelector.ledgerSequence),
					source: selection.entitySelector.source,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>contract</dt>
				<dd>
					<SorobanContractView
						selection={select(EntityType.SorobanContract, selection.entitySelector.$contract)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>ledger sequence</dt>
				<dd>
					{selection.entitySelector.ledgerSequence}
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							observedAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const observedAtMs = entity.observedAtMs}
					{#if observedAtMs != null}
						<div>
							<dt>observed AT ms</dt>
							<dd>
								{observedAtMs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							wasmHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const wasmHash = entity.wasmHash}
					{#if wasmHash != null}
						<div>
							<dt>Wasm hash</dt>
							<dd>
								<TruncatedValue value={wasmHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$wasm}
			>
				{#snippet children(sorobanWasm)}
					{#if sorobanWasm != null}
						{@const sorobanWasmInitial = untrack(() => sorobanWasm)}
						<div>
							<dt>Wasm</dt>
							<dd>
								<SorobanWasmView
									selection={select(EntityType.SorobanWasm, (sorobanWasm ?? sorobanWasmInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							executableKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const executableKind = entity.executableKind}
					{#if executableKind != null}
						<div>
							<dt>executable kind</dt>
							<dd>
								{executableKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastModifiedLedger: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const lastModifiedLedger = entity.lastModifiedLedger}
					{#if lastModifiedLedger != null}
						<div>
							<dt>last modified ledger</dt>
							<dd>
								{lastModifiedLedger}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							liveUntilLedger: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const liveUntilLedger = entity.liveUntilLedger}
					{#if liveUntilLedger != null}
						<div>
							<dt>live until ledger</dt>
							<dd>
								{liveUntilLedger}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							found: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const found = entity.found}
					{#if found != null}
						<div>
							<dt>found</dt>
							<dd>
								{found ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
