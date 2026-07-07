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
		title = 'Git object verification observations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'GitObjectVerification_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.GitObjectVerification_Timestamp>
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
	import GitObjectVerification_TimestampView from '$/views/GitObjectVerification_TimestampView.svelte'
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
					objectId: true,
					status: true,
					timestampMs: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.GitObjectVerification_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(gitObjectVerificationTimestamps)}
			{@const uniqueGitObjectVerificationTimestamps = [...new Map(gitObjectVerificationTimestamps.values.map((gitObjectVerificationTimestamp) => [gitObjectVerificationTimestamp[EntityMetaKey.SelectorKey], gitObjectVerificationTimestamp])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.GitObjectVerification_Timestamp}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={gitObjectVerificationTimestamps.totalCount}
				getKey={(gitObjectVerificationTimestamp) => gitObjectVerificationTimestamp[EntityMetaKey.SelectorKey]}
				items={uniqueGitObjectVerificationTimestamps}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Git object verification observations yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: gitObjectVerificationTimestamp }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.GitObjectVerification_Timestamp> })}
					{@const gitObjectVerificationTimestampFields = { ...gitObjectVerificationTimestamp[EntityMetaKey.Selector], ...gitObjectVerificationTimestamp }}
					<GitObjectVerification_TimestampView
						selection={select(EntityType.GitObjectVerification_Timestamp, gitObjectVerificationTimestamp[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={gitObjectVerificationTimestampFields}
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
		entityType={EntityType.GitObjectVerification_Timestamp}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
