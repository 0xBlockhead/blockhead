<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		selection,
		open = $bindable(true),
		collapsible = true,
		title = 'Log topics',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmTopic>
			open?: boolean
			collapsible?: boolean
			title?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'id'
			| 'CollapsibleProps'
		>
	> = $props()


	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import EvmTopicView from '$/views/EvmTopicView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmTopic}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Log topics are 32-byte words in receipt logs. Topic 0 often matches a keccak hash of an ABI log signature, but raw <code>LOG</code> emissions are not required to follow that convention.
		</p>
		<p>
			They are distinct from four-byte function selectors on calldata.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No indexed log topics yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<ResourceBoundary
				resource={selection({
						limit: 4096,
					})}
				placeholderText="Loading topics…"
			>
				{#snippet children(topics)}
			<EntitiesList
				collapsible={false}
				showSummary={false}
				entityType={EntityType.EvmTopic}
				getKey={(topic) => topic.entitySelector.hex}
				getSortValue={(topic) => topic.entitySelector.hex}
				placeholderText="Loading indexed log topics…"
				items={topics.entities}
				UnorderedListProps={{ orientation: ListOrientation.Column }}
				{title}
				open={true}
			>
				{#snippet Empty()}
					<p data-text="muted">
						No indexed log topics yet.
					</p>
				{/snippet}

				{#snippet Item({ item })}
					<EvmTopicView
						selection={select(EntityType.EvmTopic, item.entitySelector)}
						layout={EntityLayout.Summary}

						collapsible={false}
						showTypeAnnotation={false}
					/>
				{/snippet}
			</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
