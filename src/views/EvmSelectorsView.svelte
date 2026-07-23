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
	import { Source } from '$/sources/Source.ts'




	// State
	let {
		selection,
		countResource,
		title = 'EVM selectors',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmSelectors-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmSelector>
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
	entityType={EntityType.EvmSelector}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources ?? [
				Source.Openchain_Rest,
			],
			fields: {
				hex: true,
			},
		})
	}
	{countResource}
	getResourceItems={(evmSelectors) => [...new Map(evmSelectors.values.map((evmSelector) => [evmSelector[EntityMetaKey.SelectorKey], evmSelector])).values()]}
	getKey={(evmSelector) => evmSelector[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM selectors yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmSelector })}
		{@const evmSelectorFields = { ...evmSelector[EntityMetaKey.Selector], ...evmSelector }}
		<EntityView
			entityType={EntityType.EvmSelector}
			entitySelector={evmSelector[EntityMetaKey.Selector]}
			href={
				(
					evmSelector[EntityMetaKey.Selector] != null && 'hex' in evmSelector[EntityMetaKey.Selector]
					&& evmSelector[EntityMetaKey.Selector].hex != null ?
						resolve('/evm/selector/[hex=zeroExHex]', {
					hex: String(evmSelector[EntityMetaKey.Selector].hex ?? ''),
				})
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{'EVM selector'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
