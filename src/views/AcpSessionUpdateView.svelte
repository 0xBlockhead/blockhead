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
	}: Omit<EntitySelectionViewProps<EntityType.AcpSessionUpdate>, 'prefetched'> = $props()

	const acpSessionUpdate = $derived(selection({
		sources: selection.sources ?? [
			Source.AcpLocal_JsonRpc,
		],
	})({
		fields: {
			updateKind: true,
			timestampMs: true,
		},
	}))
	const titleFallback = $derived(`Update #${selection.entitySelector.sequence}`)


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import AcpSessionView from '$/views/AcpSessionView.svelte'
</script>


<EntityView
	entityType={EntityType.AcpSessionUpdate}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	idDragPlainText={String(selection.entitySelector.sequence)}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<span data-row="inline align-center gap-2 wrap">
			<span>Update </span>
			<span data-badge="small">
				#{selection.entitySelector.sequence}
			</span>
		</span>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={acpSessionUpdate}>
			{#snippet children(entity)}
				{entity.updateKind || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={acpSessionUpdate}>
			{#snippet children(entity)}
				{@const timestampMs = entity.timestampMs}
				{#if timestampMs != null}
					<span data-text="muted">
						<Timestamp timestamp={timestampMs} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>session</dt>
				<dd>
					<AcpSessionView
						selection={select(EntityType.AcpSession, selection.entitySelector.$session)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>sequence</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.sequence}
					/>
				</dd>
			</div>

			<div>
				<dt>update kind</dt>
				<dd>
					<ResourceBoundary
						resource={acpSessionUpdate}
					>
						{#snippet children(entity)}
							{entity.updateKind}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={acpSessionUpdate}
			>
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={timestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
