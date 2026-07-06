<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'EIP-8004 agent registration files',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'Eip8004AgentRegistrationFiles-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.Eip8004AgentRegistrationFile>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Eip8004AgentRegistrationFileView from '$/views/Eip8004AgentRegistrationFileView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					fileUrl: true,
					$registration: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Eip8004AgentRegistrationFile}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(eip8004AgentRegistrationFiles)}
			{@const uniqueEip8004AgentRegistrationFiles = [...new Map(eip8004AgentRegistrationFiles.values.map((eip8004AgentRegistrationFile) => [eip8004AgentRegistrationFile[EntityMetaKey.SelectorKey], eip8004AgentRegistrationFile])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.Eip8004AgentRegistrationFile}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={eip8004AgentRegistrationFiles.totalCount}
				getKey={(eip8004AgentRegistrationFile) => eip8004AgentRegistrationFile[EntityMetaKey.SelectorKey]}
				items={uniqueEip8004AgentRegistrationFiles}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No EIP-8004 agent registration files yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: eip8004AgentRegistrationFile }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.Eip8004AgentRegistrationFile> })}
					{@const eip8004AgentRegistrationFileFields = { ...eip8004AgentRegistrationFile[EntityMetaKey.Selector], ...eip8004AgentRegistrationFile }}
					<Eip8004AgentRegistrationFileView
						selection={select(EntityType.Eip8004AgentRegistrationFile, eip8004AgentRegistrationFile[EntityMetaKey.Selector])}
						prefetched={eip8004AgentRegistrationFileFields}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.Eip8004AgentRegistrationFile}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
