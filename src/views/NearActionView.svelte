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
	}: EntitySelectionViewProps<EntityType.NearAction> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.NearRpc_JsonRpc,
		],
	}))
	const nearAction = $derived(viewSelection({
		fields: {
			actionKind: true,
			methodName: true,
		},
	}))
	const titleFallback = $derived((prefetched.actionKind ?? '') || 'near action')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NearTransactionView from '$/views/NearTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.NearAction}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={nearAction}>
			{#snippet children(entity)}
				{entity.actionKind || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={nearAction}>
			{#snippet children(entity)}
				{(entity.methodName ?? '') || entity.actionKind || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NumberValue
				value={selection.entitySelector.actionIndex}
			/>
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Transaction</dt>
				<dd>
					<NearTransactionView
						selection={select(EntityType.NearTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Action index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.actionIndex}
					/>
				</dd>
			</div>

			<div>
				<dt>Action kind</dt>
				<dd>
					<ResourceBoundary
						resource={nearAction}
					>
						{#snippet children(entity)}
							{entity.actionKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={nearAction}
			>
				{#snippet children(entity)}
					{@const methodName = entity.methodName}
					{#if methodName != null}
						<div>
							<dt>Method name</dt>
							<dd>
								{methodName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							depositYoctoNear: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const depositYoctoNear = entity.depositYoctoNear}
					{#if depositYoctoNear != null}
						<div>
							<dt>Deposit yocto near</dt>
							<dd>
								<NumberValue
									value={depositYoctoNear}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
