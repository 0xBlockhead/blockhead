<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityFieldReference } from '$/schema/EntityFieldReference.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'
	import { stringify } from 'devalue'
	import { ListOrientation } from '$/components/ListOrientation.ts'


	// Context
	import { writeLocalBlockheadSession } from '$/collections/localMutations.ts'
	import { appClient, proxy } from '$/routes/+layout.svelte'


	// State
	let {
		entityFieldReference,
		title = 'Simulator sessions',
		open = $bindable(true),
		collapsible = true,
		id,
		...EntitiesListProps
	}: WithRest<
		{
			entityFieldReference: EntityFieldReference<
				typeof schema,
				EntityType.BlockheadSession
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

	

	let sessionName = $state('')


	// Actions
	const createSession = () => {
		writeLocalBlockheadSession(appClient, entityFieldReference.selector, sessionName)
		sessionName = ''
	}


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadSessionView from '$/views/BlockheadSessionView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BlockheadSession}
	{id}
	{title}
	bind:open
	{collapsible}
	{...EntitiesListProps}
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Saved simulation projects: named capture points, loop counters, and replay bookkeeping for scripted EVM or HTTP traces.
		</p>
		<p>
			Such traces are diagnostics—compare their implied state roots to a live node instead of treating them as canonical chain history.
		</p>
	{/snippet}

	{#snippet Empty()}
		<p data-text="muted">
			No sessions yet.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{#if open}
			<form
				data-row="align-center"
				onsubmit={(event) => {
					event.preventDefault()
					createSession()
				}}
			>
				<label for={`${id}-session-name`}>
					New session
				</label>

				<input
					id={`${id}-session-name`}
					type="text"
					bind:value={sessionName}
					placeholder="Untitled session"
				/>

				<button type="submit">
					Create
				</button>
			</form>

			<ResourceBoundary resource={proxy(
					entityFieldReference.entityType,
					entityFieldReference.selector,
					{
						sources: [Source.Local_Internal],
					}
				).field(entityFieldReference.fieldName, {
					sources: [Source.Local_Internal],
				})} placeholderText="Loading sessions…">
				{#snippet children(sessions)}
					<EntitiesList
						collapsible={false}
						showSummary={false}
						entityType={EntityType.BlockheadSession}
						id={`${id}-items`}
						{title}
						open={true}
						getKey={(session) => stringify(session.entitySelector)}
						getSortValue={(session) => stringify(session.entitySelector)}
						items={sessions.entities}
						UnorderedListProps={{ orientation: ListOrientation.Column }}
					>
						{#snippet Empty()}
							<p data-text="muted">No sessions yet.</p>
						{/snippet}

						{#snippet Item({ item })}
							<BlockheadSessionView
								selector={item.entitySelector}
								layout={EntityLayout.Summary}

							/>
						{/snippet}
					</EntitiesList>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}
</EntitiesList>
