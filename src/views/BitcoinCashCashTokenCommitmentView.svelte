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
	}: EntitySelectionViewProps<EntityType.BitcoinCashCashTokenCommitment> = $props()

	const bitcoinCashCashTokenCommitment = $derived(selection({
		sources: selection.sources ?? [
			Source.BitcoinCashNode_JsonRpc,
		],
	})({
		fields: {
			commitmentHex: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import UtxoOutputView from '$/views/UtxoOutputView.svelte'
</script>


<EntityView
	entityType={EntityType.BitcoinCashCashTokenCommitment}
	entitySelector={selection.entitySelector}
	title={title ?? ((prefetched.commitmentHex ?? '') || 'Bitcoin Cash CashToken commitment')}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={bitcoinCashCashTokenCommitment}>
			{#snippet children(entity)}
				<TruncatedValue value={entity.commitmentHex} />
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bitcoinCashCashTokenCommitment}>
			{#snippet children(entity)}
				<TruncatedValue value={entity.commitmentHex} />
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<UtxoOutputView
				selection={select(EntityType.UtxoOutput, selection.entitySelector.$output)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Commitment hex</dt>
				<dd>
					<ResourceBoundary
						resource={bitcoinCashCashTokenCommitment}
					>
						{#snippet children(entity)}
							<TruncatedValue value={entity.commitmentHex} />
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Output</dt>
				<dd>
					<UtxoOutputView
						selection={select(EntityType.UtxoOutput, selection.entitySelector.$output)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
