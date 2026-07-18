<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Zcash shielded pool block states',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'ZcashShieldedPoolBlockStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.ZcashShieldedPoolBlockState>
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
	import ZcashShieldedPoolBlockStateView from '$/views/ZcashShieldedPoolBlockStateView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.ZcashShieldedPoolBlockState}
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
				$pool: true,
				saplingTree: true,
				orchardTree: true,
			},
		})
	}
	getResourceItems={(zcashShieldedPoolBlockStates) => [...new Map(zcashShieldedPoolBlockStates.values.map((zcashShieldedPoolBlockState) => [zcashShieldedPoolBlockState[EntityMetaKey.SelectorKey], zcashShieldedPoolBlockState])).values()]}
	getKey={(zcashShieldedPoolBlockState) => zcashShieldedPoolBlockState[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Zcash shielded pool block states yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: zcashShieldedPoolBlockState })}
		{@const zcashShieldedPoolBlockStateFields = { ...zcashShieldedPoolBlockState[EntityMetaKey.Selector], ...zcashShieldedPoolBlockState }}
		{@const selection = select(EntityType.ZcashShieldedPoolBlockState, zcashShieldedPoolBlockState[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<ZcashShieldedPoolBlockStateView
			selection={selection}
			prefetched={zcashShieldedPoolBlockStateFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
