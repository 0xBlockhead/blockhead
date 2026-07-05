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
		title = 'Sui programmable transaction commands',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SuiProgrammableTransactionCommands-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.SuiProgrammableTransactionCommand>
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
	import SuiProgrammableTransactionCommandView from '$/views/SuiProgrammableTransactionCommandView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={selection}
		{placeholderText}
	>
		{#snippet children(suiProgrammableTransactionCommands)}
			{@const uniqueSuiProgrammableTransactionCommands = [...new Map(suiProgrammableTransactionCommands.values.map((suiProgrammableTransactionCommand) => [suiProgrammableTransactionCommand[EntityMetaKey.SelectorKey], suiProgrammableTransactionCommand])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.SuiProgrammableTransactionCommand}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={suiProgrammableTransactionCommands.totalCount}
				getKey={(suiProgrammableTransactionCommand) => suiProgrammableTransactionCommand[EntityMetaKey.SelectorKey]}
				items={uniqueSuiProgrammableTransactionCommands}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Sui programmable transaction commands yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: suiProgrammableTransactionCommand }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.SuiProgrammableTransactionCommand> })}
					{@const suiProgrammableTransactionCommandFields = { ...suiProgrammableTransactionCommand[EntityMetaKey.Selector], ...suiProgrammableTransactionCommand }}
					<SuiProgrammableTransactionCommandView
						selection={select(EntityType.SuiProgrammableTransactionCommand, suiProgrammableTransactionCommand[EntityMetaKey.Selector])}
						prefetched={suiProgrammableTransactionCommandFields}
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
		entityType={EntityType.SuiProgrammableTransactionCommand}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
