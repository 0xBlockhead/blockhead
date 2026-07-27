<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.CctpFee> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = $derived((pendingEntity.apiHost ?? '') || 'CCTP fee')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<EntityView
	entityType={EntityType.CctpFee}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(pendingEntity.apiHost ?? '') || 'CCTP fee'}
	{/snippet}

	{#snippet Value()}
		{[String(pendingEntity.fromDomain ?? ''), String(pendingEntity.toDomain ?? '')].filter(Boolean).join(' ') || (pendingEntity.apiHost ?? '') || titleFallback}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>API host</dt>
				<dd>
					{pendingEntity.apiHost}
				</dd>
			</div>

			<div>
				<dt>From domain</dt>
				<dd>
					{String(pendingEntity.fromDomain)}
				</dd>
			</div>

			<div>
				<dt>To domain</dt>
				<dd>
					{String(pendingEntity.toDomain)}
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
