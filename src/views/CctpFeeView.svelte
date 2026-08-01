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

	const titleFallback = $derived(selection.entitySelector.apiHost || 'CCTP fee')


	// Components
</script>


<EntityView
	entityType={EntityType.CctpFee}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		{[String(selection.entitySelector.fromDomain), String(selection.entitySelector.toDomain)].filter(Boolean).join(' ') || selection.entitySelector.apiHost || titleFallback}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>API host</dt>
				<dd>
					{selection.entitySelector.apiHost}
				</dd>
			</div>

			<div>
				<dt>From domain</dt>
				<dd>
					{selection.entitySelector.fromDomain}
				</dd>
			</div>

			<div>
				<dt>To domain</dt>
				<dd>
					{selection.entitySelector.toDomain}
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
