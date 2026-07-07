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
		title = 'A2A push notification configs',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'A2aPushNotificationConfigs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.A2aPushNotificationConfig>
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
	import A2aPushNotificationConfigView from '$/views/A2aPushNotificationConfigView.svelte'
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
					configId: true,
					status: true,
					url: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.A2aPushNotificationConfig}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(a2aPushNotificationConfigs)}
			{@const uniqueA2aPushNotificationConfigs = [...new Map(a2aPushNotificationConfigs.values.map((a2aPushNotificationConfig) => [a2aPushNotificationConfig[EntityMetaKey.SelectorKey], a2aPushNotificationConfig])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.A2aPushNotificationConfig}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={a2aPushNotificationConfigs.totalCount}
				getKey={(a2aPushNotificationConfig) => a2aPushNotificationConfig[EntityMetaKey.SelectorKey]}
				items={uniqueA2aPushNotificationConfigs}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No A2A push notification configs yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: a2aPushNotificationConfig }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.A2aPushNotificationConfig> })}
					{@const a2aPushNotificationConfigFields = { ...a2aPushNotificationConfig[EntityMetaKey.Selector], ...a2aPushNotificationConfig }}
					<A2aPushNotificationConfigView
						selection={select(EntityType.A2aPushNotificationConfig, a2aPushNotificationConfig[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={a2aPushNotificationConfigFields}
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
		entityType={EntityType.A2aPushNotificationConfig}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
