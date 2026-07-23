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
		title = 'EVM protocols',
		typeAnnotationParagraphs = ['Catalog surface for EVM signature, topic, and error registries.'],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmProtocols-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmProtocol>
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
	entityType={EntityType.EvmProtocol}
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
				protocolName: true,
				registryName: true,
				scope: true,
			},
		})
	}
	{countResource}
	getResourceItems={(evmProtocols) => [...new Map(evmProtocols.values.map((evmProtocol) => [evmProtocol[EntityMetaKey.SelectorKey], evmProtocol])).values()]}
	getKey={(evmProtocol) => evmProtocol[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM protocols yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmProtocol })}
		{@const evmProtocolFields = { ...evmProtocol[EntityMetaKey.Selector], ...evmProtocol }}
		<EntityView
			entityType={EntityType.EvmProtocol}
			entitySelector={evmProtocol[EntityMetaKey.Selector]}
			href={
				(
					evmProtocol[EntityMetaKey.Selector].scope === 'EvmProtocol' ?
						resolve('/evm')
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((evmProtocolFields.protocolName) ?? '')].filter(Boolean).join(' ') || 'EVM protocol'}
			{/snippet}

			{#snippet Value()}
				{[String((evmProtocolFields.registryName) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
