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
		title = 'A2A push notification configs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'A2aPushNotificationConfigs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.A2aPushNotificationConfig>
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
	import A2aPushNotificationConfigView from '$/views/A2aPushNotificationConfigView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.A2aPushNotificationConfig}
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
				configId: true,
				status: true,
				url: true,
			},
		})
	}
	getResourceItems={(a2aPushNotificationConfigs) => [...new Map(a2aPushNotificationConfigs.values.map((a2aPushNotificationConfig) => [a2aPushNotificationConfig[EntityMetaKey.SelectorKey], a2aPushNotificationConfig])).values()]}
	getKey={(a2aPushNotificationConfig) => a2aPushNotificationConfig[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No A2A push notification configs yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: a2aPushNotificationConfig })}
		{@const a2aPushNotificationConfigFields = { ...a2aPushNotificationConfig[EntityMetaKey.Selector], ...a2aPushNotificationConfig }}
		{@const selection = select(EntityType.A2aPushNotificationConfig, a2aPushNotificationConfig[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<A2aPushNotificationConfigView
			selection={selection}
			prefetched={a2aPushNotificationConfigFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
