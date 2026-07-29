<!-- Generated from APP.ts. Do not edit by hand. -->

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
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.LitecoinMwebOutput> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.LitecoinCore_JsonRpc,
		],
	}))
	const litecoinMwebOutput = $derived(viewSelection({
		fields: {
			commitment: true,
		},
	}))
	const titleFallback = $derived((prefetched.commitment ?? '') || 'litecoin MWEB output')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import LitecoinMwebTransactionView from '$/views/LitecoinMwebTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.LitecoinMwebOutput}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={litecoinMwebOutput}>
			{#snippet children(entity)}
				{(entity.commitment ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<NumberValue
			value={selection.entitySelector.outputIndex}
		/>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>transaction</dt>
				<dd>
					<LitecoinMwebTransactionView
						selection={select(EntityType.LitecoinMwebTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>output index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.outputIndex}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={litecoinMwebOutput}
			>
				{#snippet children(entity)}
					{@const commitment = entity.commitment}
					{#if commitment != null}
						<div>
							<dt>commitment</dt>
							<dd>
								{commitment}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							senderPubkey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const senderPubkey = entity.senderPubkey}
					{#if senderPubkey != null}
						<div>
							<dt>sender public key</dt>
							<dd>
								{senderPubkey}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
