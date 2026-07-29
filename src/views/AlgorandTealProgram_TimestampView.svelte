<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.AlgorandTealProgram_Timestamp> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AlgorandTealProgramView from '$/views/AlgorandTealProgramView.svelte'
</script>


<EntityView
	entityType={EntityType.AlgorandTealProgram_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'algorand teal program timestamp'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		algorand teal program timestamp
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>program</dt>
				<dd>
					<AlgorandTealProgramView
						selection={select(EntityType.AlgorandTealProgram, selection.entitySelector.$program)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							bytecode: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const bytecode = entity.bytecode}
					{#if bytecode != null}
						<div>
							<dt>bytecode</dt>
							<dd>
								{bytecode}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							disassembly: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const disassembly = entity.disassembly}
					{#if disassembly != null}
						<div>
							<dt>disassembly</dt>
							<dd>
								{disassembly}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							compileResultHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const compileResultHash = entity.compileResultHash}
					{#if compileResultHash != null}
						<div>
							<dt>compile result hash</dt>
							<dd>
								<TruncatedValue value={compileResultHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
