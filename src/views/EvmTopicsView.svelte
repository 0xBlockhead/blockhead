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
		title = 'EVM topics',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EvmTopics-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EvmTopic>
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
	entityType={EntityType.EvmTopic}
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
	getResourceItems={(evmTopics) => [...new Map(evmTopics.values.map((evmTopic) => [evmTopic[EntityMetaKey.SelectorKey], evmTopic])).values()]}
	getKey={(evmTopic) => evmTopic[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No EVM topics yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: evmTopic })}
		{@const evmTopicFields = { ...evmTopic[EntityMetaKey.Selector], ...evmTopic }}
		<EntityView
			entityType={EntityType.EvmTopic}
			entitySelector={evmTopic[EntityMetaKey.Selector]}
			href={
				(
					evmTopic[EntityMetaKey.Selector] != null && 'hex' in evmTopic[EntityMetaKey.Selector]
					&& evmTopic[EntityMetaKey.Selector].hex != null ?
						resolve('/evm/topic/[hex=evmTopicHash]', {
					hex: String(evmTopic[EntityMetaKey.Selector].hex ?? ''),
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
				{'EVM topic'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
