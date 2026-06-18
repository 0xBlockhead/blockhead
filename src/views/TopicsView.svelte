<script lang="ts">
	import type { EntityFieldName, EntityType as EntityTypeName } from '$/schema/$schema.ts'
	import type { EntityProxyFieldResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { SvelteSet } from 'svelte/reactivity'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	// State
	let {
		selection,
		title = 'Log topics',
		open = $bindable(true),
		collapsible = true,
		id,
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyFieldResource<
				typeof schema,
				EntityTypeName<typeof schema>,
				EntityFieldName<typeof schema, EntityTypeName<typeof schema>>
			>
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

	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
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
						id={`${id}-items`}
						{title}
						open={true}
						items={topics.entities}
						placeholderText="Loading topics…"
						getKey={(topic) => topic.entitySelector.hex}
						getSortValue={(topic) => topic.entitySelector.hex}
						placeholderKeys={new SvelteSet<string>()}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No log topics indexed yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<EvmTopicView
								selector={item.entitySelector}
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
