<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.AlgorandTealProgram_Timestamp>, 'prefetched'> = $props()

	const program = $derived(selection.entitySelector.$program)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AlgorandTealProgramView from '$/views/AlgorandTealProgramView.svelte'
</script>


<EntityView
	entityType={EntityType.AlgorandTealProgram_Timestamp}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/teal-program/[programHash=zeroExHex]/(algorandTealProgram)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in program.$network.$network ?
							caip2StringFromValue(program.$network.$network.caip2)
						:
							program.$network.$network.slug
					),
					programHash: program.programHash,
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>program</dt>
				<dd>
					<AlgorandTealProgramView
						selection={select(EntityType.AlgorandTealProgram, selection.entitySelector.$program)}
						layout={EntityLayout.Value}
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
