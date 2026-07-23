<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadAgentProgramInstall>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.BlockheadAgentProgramInstall}
			entitySelector={blockheadAgentProgramInstall[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadAgentProgramInstallFields.installId) ?? '')].filter(Boolean).join(' ') || 'blockhead agent program install'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadAgentProgramInstallFields.command) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadAgentProgramInstallFields.updatedAt) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
