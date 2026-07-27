<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: EntitySelectionViewProps<EntityType.MoneroKeyImage> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = $derived((pendingEntity.keyImage ?? '') || 'monero key image')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import MoneroTransactionView from '$/views/MoneroTransactionView.svelte'
	import MoneroRingView from '$/views/MoneroRingView.svelte'
</script>


<EntityView
	entityType={EntityType.MoneroKeyImage}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={pendingEntity.keyImage} />
	{/snippet}

	{#snippet Value()}
		<NumberValue
			value={pendingEntity.inputIndex}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$ring}
		>
			{#snippet children(moneroRing)}
				{#if moneroRing != null}
					<span data-text="muted">
						<MoneroRingView
							selection={select(EntityType.MoneroRing, moneroRing[EntityMetaKey.Selector])}
							prefetched={moneroRing}
							layout={EntityLayout.Title}
							open={false}
						/>
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
				<dt>Input index</dt>
				<dd>
					<NumberValue
						value={pendingEntity.inputIndex}
					/>
				</dd>
			</div>

			<div>
				<dt>Key image</dt>
				<dd>
					<TruncatedValue value={pendingEntity.keyImage} />
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$ring}
			>
				{#snippet children(moneroRing)}
					{#if moneroRing != null}
						<div>
							<dt>Ring</dt>
							<dd>
								<MoneroRingView
									selection={select(EntityType.MoneroRing, moneroRing[EntityMetaKey.Selector])}
									prefetched={moneroRing}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
