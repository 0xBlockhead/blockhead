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
	}: Omit<EntitySelectionViewProps<EntityType.MoneroRingMember>, 'prefetched'> = $props()

	const moneroRingMember = $derived(selection({
		sources: selection.sources ?? [
			Source.MoneroDaemonRpc_JsonRpc,
		],
		fields: {
			globalOutputIndex: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import MoneroRingView from '$/views/MoneroRingView.svelte'
</script>


<EntityView
	entityType={EntityType.MoneroRingMember}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.memberIndex)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={selection.entitySelector.memberIndex}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={moneroRingMember}>
			{#snippet children(entity)}
				{@const globalOutputIndex = entity.globalOutputIndex}
				{#if globalOutputIndex != null}
					<NumberValue
						value={globalOutputIndex}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Ring</dt>
				<dd>
					<MoneroRingView
						selection={select(EntityType.MoneroRing, selection.entitySelector.$ring)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Member index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.memberIndex}
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
