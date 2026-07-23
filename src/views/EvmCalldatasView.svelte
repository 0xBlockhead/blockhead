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




	// State
	let {
		selection,
		countResource,
		title = 'EVM calldata',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmCalldatas-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmCalldata>
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
	entityType={EntityType.EvmCalldata}
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
				hex: true,
			},
		})
	}
	{countResource}
	getResourceItems={(evmCalldatas) => [...new Map(evmCalldatas.values.map((evmCalldata) => [evmCalldata[EntityMetaKey.SelectorKey], evmCalldata])).values()]}
	getKey={(evmCalldata) => evmCalldata[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM calldata yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmCalldata })}
		{@const evmCalldataFields = { ...evmCalldata[EntityMetaKey.Selector], ...evmCalldata }}
		<EntityView
			entityType={EntityType.EvmCalldata}
			entitySelector={evmCalldata[EntityMetaKey.Selector]}
			href={
				(
					evmCalldata[EntityMetaKey.Selector] != null && 'hex' in evmCalldata[EntityMetaKey.Selector]
					&& evmCalldata[EntityMetaKey.Selector].hex != null ?
						resolve('/evm/calldata/[hex=zeroExHex]', {
					hex: String(evmCalldata[EntityMetaKey.Selector].hex ?? ''),
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
				{[String((evmCalldataFields.hex) ?? '')].filter(Boolean).join(' ') || 'EVM calldata'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
