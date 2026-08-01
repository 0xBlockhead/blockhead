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
	}: EntitySelectionViewProps<EntityType.AcpPromptTurn> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.AcpLocal_JsonRpc,
		],
	}))
	const acpPromptTurn = $derived(viewSelection({
		fields: {
			stopReason: true,
			startedAt: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.turnId || 'ACP prompt turn')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AcpSessionView from '$/views/AcpSessionView.svelte'
</script>


<EntityView
	entityType={EntityType.AcpPromptTurn}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={acpPromptTurn}>
			{#snippet children(entity)}
				{(entity.stopReason ?? '') || selection.entitySelector.turnId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={acpPromptTurn}>
			{#snippet children(entity)}
				{@const startedAt = entity.startedAt}
				{#if startedAt != null}
					<span data-text="muted">
						<Timestamp timestamp={startedAt} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
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
				<dt>turn ID</dt>
				<dd>
					{selection.entitySelector.turnId}
				</dd>
			</div>

			<ResourceBoundary
				resource={acpPromptTurn}
			>
				{#snippet children(entity)}
					{@const stopReason = entity.stopReason}
					{#if stopReason != null}
						<div>
							<dt>stop reason</dt>
							<dd>
								{stopReason}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={acpPromptTurn}
			>
				{#snippet children(entity)}
					{@const startedAt = entity.startedAt}
					{#if startedAt != null}
						<div>
							<dt>started AT</dt>
							<dd>
								<Timestamp timestamp={startedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							completedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const completedAt = entity.completedAt}
					{#if completedAt != null}
						<div>
							<dt>completed AT</dt>
							<dd>
								<Timestamp timestamp={completedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							cancelledAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const cancelledAt = entity.cancelledAt}
					{#if cancelledAt != null}
						<div>
							<dt>cancelled AT</dt>
							<dd>
								<Timestamp timestamp={cancelledAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							userPromptHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const userPromptHashAlgorithm = entity.userPromptHashAlgorithm}
					{#if userPromptHashAlgorithm != null}
						<div>
							<dt>user prompt hash algorithm</dt>
							<dd>
								{userPromptHashAlgorithm}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							userPromptHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const userPromptHash = entity.userPromptHash}
					{#if userPromptHash != null}
						<div>
							<dt>user prompt hash</dt>
							<dd>
								<TruncatedValue value={userPromptHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
