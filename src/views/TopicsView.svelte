<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { Entity } from '$/schema/$schema.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { useEntity } from '$/collections/$collections.ts'
	import { entityCollectionsContext } from '$/collections/entityCollections.ts'
	// State
	let {
		entityFieldReference,
		title = 'Log topics',
		open = $bindable(true),
		collapsible = true,
		id,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<typeof schema, EntityType.EvmTopic>
			title?: string
			open?: boolean
			collapsible?: boolean
			id: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	import { derive } from '$/lib/svelte/RemoteResource.svelte.ts'


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmTopicView from '$/views/EvmTopicView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	bind:open
	{collapsible}
	entityType={EntityType.EvmTopic}
	{id}
	{title}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Log topics are 32-byte receipt-log words. Topic 0 often matches a keccak hash of an ABI log signature when the emitter followed Solidity/Vyper conventions.
		</p>
		<p>
			They are indexed separately from function selectors, market candles, storage links, or messaging threads.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No log topics indexed yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			{@const parent = useEntity(entityCollectionsContext,
				entityFieldReference.entityType,
				entityFieldReference.entityId,({ sources: [
						Source.Constants_Internal,
						Source.Openchain_Rest,
					], fields: { [entityFieldReference.fieldName]: {
						limit: 4096,
					},
				} }),
			)}
			{@const topics = derive(
				parent,
				(parent): readonly Entity<typeof schema, EntityType.EvmTopic>[] => (
					parent.fields[entityFieldReference.fieldName]?.values
					?? []
				),
			)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmTopic}
				id={`${id}-items`}
				{title}
				open={true}
				resource={topics}
				placeholderText="Loading topics…"
				getKey={(topic) => topic[EntityMetaKey.Id].hex}
				getSortValue={(topic) => topic[EntityMetaKey.Id].hex}
				placeholderKeys={new SvelteSet<string>()}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No log topics indexed yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					{@const topicId = item[EntityMetaKey.Id]}
					<EvmTopicView
						entityId={topicId}
						layout={EntityLayout.Summary}
						open={false}
						collapsible={false}
						showTypeAnnotation={false}
					/>
				{/snippet}
			</EntitiesList>
		{/if}
	{/snippet}
</EntitiesList>
