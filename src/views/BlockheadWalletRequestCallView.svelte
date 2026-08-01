<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadWalletRequestCall>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadWalletRequestCall = $derived(viewSelection({
		fields: {
			toAddress: true,
		},
	}))
	const titleFallback = $derived(`Call #${selection.entitySelector.callIndex}`)


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadWalletRequestView from '$/views/BlockheadWalletRequestView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadWalletRequestCall}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	idDragPlainText={String(selection.entitySelector.callIndex)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Call </span>
			<span data-badge="small">
				#{selection.entitySelector.callIndex}
			</span>
		</span>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadWalletRequestCall}>
			{#snippet children(entity)}
				{(entity.toAddress ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>wallet request</dt>
				<dd>
					<BlockheadWalletRequestView
						selection={select(EntityType.BlockheadWalletRequest, selection.entitySelector.$walletRequest)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>call index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.callIndex}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							caip2: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const caip2 = entity.caip2}
					{#if caip2 != null}
						<div>
							<dt>CAIP-2</dt>
							<dd>
								<TruncatedValue value={`${caip2.namespace}:${caip2.reference}`} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={blockheadWalletRequestCall}
			>
				{#snippet children(entity)}
					{@const toAddress = entity.toAddress}
					{#if toAddress != null}
						<div>
							<dt>to address</dt>
							<dd>
								<TruncatedValue value={toAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							value: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const value = entity.value}
					{#if value != null}
						<div>
							<dt>Value</dt>
							<dd>
								<NumberValue
									value={value}
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
							inputDataHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const inputDataHash = entity.inputDataHash}
					{#if inputDataHash != null}
						<div>
							<dt>input data hash</dt>
							<dd>
								<TruncatedValue value={inputDataHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
