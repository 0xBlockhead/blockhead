<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'

	// Context


	// State
	let {
		selection,
		open = $bindable(true),
		title = 'User operations',
		id,
		href = '',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EvmUserOperation>
			open?: boolean
			title?: string
			id: string
			href?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'CollapsibleProps'
		>
	> = $props()

	


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import TruncatedValue, { TruncatedValueFormat } from '$/components/TruncatedValue.svelte'
	import EvmUserOperationView from '$/views/EvmUserOperationView.svelte'
</script>


<EntitiesList
	entityType={EntityType.EvmUserOperation}
	{id}
	{title}
	bind:open
	href={href}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			ERC-4337 user operations are intent objects bundlers include in transactions to the entry point.
		</p>
	{/snippet}

	{#snippet body()}
		{#if open}
			<ResourceBoundary
				resource={selection({
						sources: [
							Source.Blockscout_Rest,
						],
						limit: 16,
					})}
				placeholderText="Loading user operations…"
			>
				{#snippet children(userOperations)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.EvmUserOperation}
						id={`${id}-items`}
						href={href}
						getKey={(userOperation) => stringify(userOperation.entitySelector)}
						placeholderText="Loading user operations…"
						items={userOperations.entities}
						{title}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
						open={true}
					>
						{#snippet Empty()}
							<p data-text="muted">No user operations.</p>
						{/snippet}

						{#snippet Item({ item: userOperation })}
							<EvmUserOperationView
								selection={select(EntityType.EvmUserOperation, userOperation.entitySelector)}
								layout={EntityLayout.Summary}

							>
								{#snippet HeadingSnippet()}
									<TruncatedValue
										format={TruncatedValueFormat.Visual}
										value={userOperation.entitySelector.hash}
									/>
								{/snippet}
							</EvmUserOperationView>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
