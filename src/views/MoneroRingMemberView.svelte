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
	}: EntitySelectionViewProps<EntityType.MoneroRingMember> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	}))
	const moneroRingMember = $derived(viewSelection({
		fields: {
			globalOutputIndex: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.memberIndex ?? '') || 'monero ring member')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import MoneroRingView from '$/views/MoneroRingView.svelte'
</script>


<EntityView
	entityType={EntityType.MoneroRingMember}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={pendingEntity.memberIndex}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={moneroRingMember}>
			{#snippet children(entity)}
				{@const globalOutputIndex0 = entity.globalOutputIndex}
				{#if globalOutputIndex0 != null}
					<NumberValue
						value={globalOutputIndex0}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Ring</dt>
				<dd>
					<MoneroRingView
						selection={select(EntityType.MoneroRing, selection.entitySelector.$ring)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Member index</dt>
				<dd>
					<NumberValue
						value={pendingEntity.memberIndex}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={moneroRingMember}
			>
				{#snippet children(entity)}
					{@const globalOutputIndex = entity.globalOutputIndex}
					{#if globalOutputIndex != null}
						<div>
							<dt>Global output index</dt>
							<dd>
								<NumberValue
									value={globalOutputIndex}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
