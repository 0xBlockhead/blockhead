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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadAgentCredentialState>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.BlockheadAgentCredentialState}
			entitySelector={blockheadAgentCredentialState[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadAgentCredentialStateFields.label) ?? '')].filter(Boolean).join(' ') || [String((blockheadAgentCredentialStateFields.credentialId) ?? '')].filter(Boolean).join(' ') || 'blockhead agent credential state'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadAgentCredentialStateFields.credentialKind) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[[String((blockheadAgentCredentialStateFields.$connection.connectionId) ?? '')].filter(Boolean).join(' ') || 'blockhead agent connection'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
