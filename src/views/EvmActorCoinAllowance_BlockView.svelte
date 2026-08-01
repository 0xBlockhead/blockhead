<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.EvmActorCoinAllowance_Block>, 'prefetched'> = $props()

	const evmActorCoinAllowanceBlock = $derived(selection({
		fields: {
			allowance: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EvmActorCoinAllowanceView from '$/views/EvmActorCoinAllowanceView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmActorCoinAllowance_Block}
	entitySelector={selection.entitySelector}
	title={title ?? 'Block ' + String(selection.entitySelector.blockNumber)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={evmActorCoinAllowanceBlock}>
			{#snippet children(entity)}
				{String(entity.allowance)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Block number</dt>
				<dd>
					{selection.entitySelector.blockNumber}
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>

			<div>
				<dt>Allowance</dt>
				<dd>
					<ResourceBoundary
						resource={evmActorCoinAllowanceBlock}
					>
						{#snippet children(entity)}
							{entity.allowance}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							blockTag: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockTag = entity.blockTag}
					{#if blockTag != null}
						<div>
							<dt>Block tag</dt>
							<dd>
								{blockTag}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							checkedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const checkedAt = entity.checkedAt}
					{#if checkedAt != null}
						<div>
							<dt>Checked at</dt>
							<dd>
								<Timestamp timestamp={checkedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Allowance</dt>
				<dd>
					<EvmActorCoinAllowanceView
						selection={select(EntityType.EvmActorCoinAllowance, selection.entitySelector.$allowance)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
