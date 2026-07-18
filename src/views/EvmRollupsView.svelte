<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'EVM rollups',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmRollups-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EvmRollup>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmRollupView from '$/views/EvmRollupView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EvmRollup}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				name: true,
				projectId: true,
				$network: true,
			},
		})
	}
	getResourceItems={(evmRollups) => [...new Map(evmRollups.values.map((evmRollup) => [evmRollup[EntityMetaKey.SelectorKey], evmRollup])).values()]}
	getKey={(evmRollup) => evmRollup[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM rollups yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmRollup })}
		{@const evmRollupFields = { ...evmRollup[EntityMetaKey.Selector], ...evmRollup }}
		{@const selection = select(EntityType.EvmRollup, evmRollup[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const evmRollupHrefFields = { ...evmRollup, ...evmRollup[EntityMetaKey.Selector] }}
		<EvmRollupView
			selection={selection}
			prefetched={evmRollupFields}
			href={
				(evmRollupHrefFields.projectId !== undefined && evmRollupHrefFields.$network !== undefined && evmRollupHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/rollup/[projectId=stringSegment]', {
					projectId: String(evmRollupHrefFields.projectId ?? ''),
					network: String(caip2StringFromValue(evmRollupHrefFields.$network.caip2) ?? ''),
				}) : evmRollupHrefFields.projectId !== undefined && evmRollupHrefFields.$network !== undefined && evmRollupHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/rollup/[projectId=stringSegment]', {
					projectId: String(evmRollupHrefFields.projectId ?? ''),
					network: String(evmRollupHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
