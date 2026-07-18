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
		title = 'Blockhead agent program installs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadAgentProgramInstalls-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BlockheadAgentProgramInstall>
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
	import BlockheadAgentProgramInstallView from '$/views/BlockheadAgentProgramInstallView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BlockheadAgentProgramInstall}
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
				installId: true,
				command: true,
				updatedAt: true,
			},
		})
	}
	getResourceItems={(blockheadAgentProgramInstalls) => [...new Map(blockheadAgentProgramInstalls.values.map((blockheadAgentProgramInstall) => [blockheadAgentProgramInstall[EntityMetaKey.SelectorKey], blockheadAgentProgramInstall])).values()]}
	getKey={(blockheadAgentProgramInstall) => blockheadAgentProgramInstall[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead agent program installs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadAgentProgramInstall })}
		{@const blockheadAgentProgramInstallFields = { ...blockheadAgentProgramInstall[EntityMetaKey.Selector], ...blockheadAgentProgramInstall }}
		{@const selection = select(EntityType.BlockheadAgentProgramInstall, blockheadAgentProgramInstall[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<BlockheadAgentProgramInstallView
			selection={selection}
			prefetched={blockheadAgentProgramInstallFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
