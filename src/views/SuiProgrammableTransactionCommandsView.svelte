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
		title = 'Sui programmable transaction commands',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'SuiProgrammableTransactionCommands-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.SuiProgrammableTransactionCommand>
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
	import SuiProgrammableTransactionCommandView from '$/views/SuiProgrammableTransactionCommandView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.SuiProgrammableTransactionCommand}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
		})
	}
	getResourceItems={(suiProgrammableTransactionCommands) => [...new Map(suiProgrammableTransactionCommands.values.map((suiProgrammableTransactionCommand) => [suiProgrammableTransactionCommand[EntityMetaKey.SelectorKey], suiProgrammableTransactionCommand])).values()]}
	getKey={(suiProgrammableTransactionCommand) => suiProgrammableTransactionCommand[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Sui programmable transaction commands yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: suiProgrammableTransactionCommand })}
		{@const suiProgrammableTransactionCommandFields = { ...suiProgrammableTransactionCommand[EntityMetaKey.Selector], ...suiProgrammableTransactionCommand }}
		{@const selection = select(EntityType.SuiProgrammableTransactionCommand, suiProgrammableTransactionCommand[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<SuiProgrammableTransactionCommandView
			selection={selection}
			prefetched={suiProgrammableTransactionCommandFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
