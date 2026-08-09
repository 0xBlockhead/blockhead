<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.CctpFee>, 'prefetched'> = $props()

	const titleFallback = $derived(selection.entitySelector.apiHost || 'CCTP fee')


	// Components
</script>


<EntityView
	entityType={EntityType.CctpFee}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/cctp/fee/[apiHost=stringSegment]/[fromDomain=nonNegativeInteger]/[toDomain=nonNegativeInteger]',
				{
					apiHost: selection.entitySelector.apiHost,
					fromDomain: String(selection.entitySelector.fromDomain),
					toDomain: String(selection.entitySelector.toDomain),
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		{[String(selection.entitySelector.fromDomain), String(selection.entitySelector.toDomain)].filter(Boolean).join(' ') || selection.entitySelector.apiHost || titleFallback}
	{/snippet}

	{#snippet Content()}
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
