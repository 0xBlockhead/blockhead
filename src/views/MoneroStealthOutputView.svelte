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
	}: EntitySelectionViewProps<EntityType.MoneroStealthOutput> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	}))
	const moneroStealthOutput = $derived(viewSelection({
		fields: {
			publicKey: true,
			commitment: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.outputIndex ?? '') || 'monero stealth output')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MoneroTransactionView from '$/views/MoneroTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.MoneroStealthOutput}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={pendingEntity.outputIndex}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={moneroStealthOutput}>
			{#snippet children(entity)}
				{@const publicKey0 = entity.publicKey}
				{#if publicKey0 != null}
					<TruncatedValue value={publicKey0} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={moneroStealthOutput}>
			{#snippet children(entity)}
				{@const commitment0 = entity.commitment}
				{#if commitment0 != null}
					<span data-text="muted">
						<TruncatedValue value={commitment0} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Transaction</dt>
				<dd>
					<MoneroTransactionView
						selection={select(EntityType.MoneroTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Output index</dt>
				<dd>
					<NumberValue
						value={pendingEntity.outputIndex}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={moneroStealthOutput}
			>
				{#snippet children(entity)}
					{@const publicKey = entity.publicKey}
					{#if publicKey != null}
						<div>
							<dt>Public key</dt>
							<dd>
								<TruncatedValue value={publicKey} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={moneroStealthOutput}
			>
				{#snippet children(entity)}
					{@const commitment = entity.commitment}
					{#if commitment != null}
						<div>
							<dt>Commitment</dt>
							<dd>
								<TruncatedValue value={commitment} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
