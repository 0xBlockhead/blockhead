<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BlockheadWalletRequestCall>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const titleFallback = $derived(`Call #${selection.entitySelector.callIndex}`)


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadWalletRequestCall}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	idDragPlainText={String(selection.entitySelector.callIndex)}
	href={
		href === undefined ?
			resolve(
				'/~/wallets/requests/[id=stringSegment]/(blockheadWalletRequest)/evm-request/(blockheadEvmWalletRequest)/call/[callIndex=nonNegativeInteger]',
				{
					id: selection.entitySelector.$evmRequest.$walletRequest.id,
					callIndex: String(selection.entitySelector.callIndex),
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
		<span data-row="inline align-center gap-2 wrap">
			<span>Call </span>
			<span data-badge="small">
				#{selection.entitySelector.callIndex}
			</span>
		</span>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={
				viewSelection({
					fields: {
						toAddress: true,
					},
				})
			}
		>
			{#snippet children(entity)}
				{(entity.toAddress ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
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

			<div>
				<dt>input data hash</dt>
				<dd>
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
							<TruncatedValue value={entity.inputDataHash} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
