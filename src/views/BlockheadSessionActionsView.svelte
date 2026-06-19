<script lang="ts">
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { ActionType, actionTypeDefinitions } from '$/constants/actions.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import {
		deleteLocalBlockheadSessionAction,
		writeLocalBlockheadSessionAction,
	} from '$/collections/localMutations.ts'
		import { appClient, select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Actions',
		open = $bindable(true),
		collapsible = true,
		id,
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BlockheadSessionAction>
				& {
					entitySelector: {
						readonly id: string
					}
				}
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

	let actionType = $state<ActionType>(
		ActionType.Swap,
	)


	

	// Actions
	const writeSessionAction = (indexInSequence: number) => {
		writeLocalBlockheadSessionAction(
			appClient,
			selection.entitySelector,
			indexInSequence,
			actionType,
		)
	}


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadSessionActionView from '$/views/BlockheadSessionActionView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BlockheadSessionAction}
	{id}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet Empty()}
		<p data-text="muted">
			No actions yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<form
				data-row="align-center"
				onsubmit={(event) => {
					event.preventDefault()
					writeSessionAction(Date.now())
				}}
			>
				<label for={`${id}-action-type`}>
					Add action
				</label>

				<select
					id={`${id}-action-type`}
					bind:value={actionType}
				>
					{#each actionTypeDefinitions as definition}
						<option value={definition.type}>
							{definition.label}
						</option>
					{/each}
				</select>

				<button type="submit">
					Add
				</button>
			</form>

			<ResourceBoundary resource={selection({
					sources: [Source.Local_Internal],
					fields: {
						indexInSequence: true,
					},
				})} placeholderText="Loading actions…">
				{#snippet children(actions)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.BlockheadSessionAction}
						id={`${id}-items`}
						{title}
						open={true}
						getKey={(action) => stringify(action.entitySelector)}
						getSortValue={(action) => stringify(action.entitySelector)}
						items={actions.entities}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">
								No actions yet.
							</p>
						{/snippet}

						{#snippet Item({ item })}
							<BlockheadSessionActionView
								selection={select(EntityType.BlockheadSessionAction, item.entitySelector)}
								layout={EntityLayout.Summary}

							/>

							<button
								type="button"
								onclick={() => deleteLocalBlockheadSessionAction(
									appClient,
									selection.entitySelector,
									item.entitySelector,
								)}
							>
								Remove
							</button>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
