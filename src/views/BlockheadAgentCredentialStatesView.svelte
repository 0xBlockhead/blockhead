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
		title = 'Blockhead agent credential states',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadAgentCredentialStates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadAgentCredentialState>
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
	import BlockheadAgentCredentialStateView from '$/views/BlockheadAgentCredentialStateView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadAgentCredentialState}
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
				label: true,
				credentialKind: true,
				credentialId: true,
				$connection: true,
			},
		})
	}
	getResourceItems={(blockheadAgentCredentialStates) => [...new Map(blockheadAgentCredentialStates.values.map((blockheadAgentCredentialState) => [blockheadAgentCredentialState[EntityMetaKey.SelectorKey], blockheadAgentCredentialState])).values()]}
	getKey={(blockheadAgentCredentialState) => blockheadAgentCredentialState[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead agent credential states yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadAgentCredentialState })}
		{@const blockheadAgentCredentialStateFields = { ...blockheadAgentCredentialState[EntityMetaKey.Selector], ...blockheadAgentCredentialState }}
		{@const selection = select(EntityType.BlockheadAgentCredentialState, blockheadAgentCredentialState[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadAgentCredentialStateView
			selection={selection}
			prefetched={blockheadAgentCredentialStateFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
