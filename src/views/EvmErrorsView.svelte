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
		title = 'EVM errors',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmErrors-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmError>
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
	entityType={EntityType.EvmError}
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
	getResourceItems={(evmErrors) => [...new Map(evmErrors.values.map((evmError) => [evmError[EntityMetaKey.SelectorKey], evmError])).values()]}
	getKey={(evmError) => evmError[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM errors yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmError })}
		{@const evmErrorFields = { ...evmError[EntityMetaKey.Selector], ...evmError }}
		<EntityView
			entityType={EntityType.EvmError}
			entitySelector={evmError[EntityMetaKey.Selector]}
			href={
				(
					evmError[EntityMetaKey.Selector] != null && 'hex' in evmError[EntityMetaKey.Selector]
					&& evmError[EntityMetaKey.Selector].hex != null ?
						resolve('/evm/error/[hex=zeroExHex]', {
					hex: String(evmError[EntityMetaKey.Selector].hex ?? ''),
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
				{'EVM error'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
