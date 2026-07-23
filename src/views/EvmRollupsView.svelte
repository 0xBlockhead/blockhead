<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmRollup>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
	{countResource}
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
		<EntityView
			entityType={EntityType.EvmRollup}
			entitySelector={evmRollup[EntityMetaKey.Selector]}
			href={
				(
					evmRollup[EntityMetaKey.Selector] != null && 'projectId' in evmRollup[EntityMetaKey.Selector]
					&& evmRollup[EntityMetaKey.Selector].projectId != null
					&& evmRollup[EntityMetaKey.Selector] != null && '$network' in evmRollup[EntityMetaKey.Selector] ?
						evmRollup[EntityMetaKey.Selector].$network != null && 'caip2' in evmRollup[EntityMetaKey.Selector].$network
						&& evmRollup[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/rollup/[projectId=stringSegment]', {
						projectId: String(evmRollup[EntityMetaKey.Selector].projectId ?? ''),
						network: String(caip2StringFromValue(evmRollup[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							evmRollup[EntityMetaKey.Selector].$network != null && 'slug' in evmRollup[EntityMetaKey.Selector].$network
							&& evmRollup[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/rollup/[projectId=stringSegment]', {
							projectId: String(evmRollup[EntityMetaKey.Selector].projectId ?? ''),
							network: String(evmRollup[EntityMetaKey.Selector].$network.slug ?? ''),
						})
						:
							undefined
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((evmRollupFields.name) ?? ''), String((evmRollupFields.projectId) ?? '')].filter(Boolean).join(' ') || 'EVM rollup'}
			{/snippet}

			{#snippet Value()}
				{[String((evmRollupFields.name) ?? ''), String((evmRollupFields.projectId) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((evmRollupFields.$network.name) ?? '')].filter(Boolean).join(' ') || [evmRollupFields.$network.caip2 == null ? '' : String(`${(evmRollupFields.$network.caip2).namespace}:${(evmRollupFields.$network.caip2).reference}`)].filter(Boolean).join(' ') || 'Network'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
