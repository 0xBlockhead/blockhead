<script lang="ts">
	// Types/constants
	import type { EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	// State
	let {
		selection,
	}: Pick<EntitySelectionViewProps<EntityType.RssItem>, 'selection'> = $props()

	let status = $state('')
	let operationError = $state('')

	const itemState = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			isRead: true,
			isStarred: true,
		},
	}))


	// Functions
	import { errorDisplayMessage } from '$/lib/errors.ts'
	import { writeLocalRssItemState } from '$/collections/localMutations.ts'

	const persistFlag = async (
		flag: 'isRead' | 'isStarred',
		value: boolean,
	) => {
		operationError = ''
		try {
			await writeLocalRssItemState(getAppClient(), {
				$feed: selection.entitySelector.$feed,
				itemIdentityKind: selection.entitySelector.itemIdentityKind,
				itemIdentity: selection.entitySelector.itemIdentity,
				[flag]: value,
			})
			status = (
				flag === 'isRead' ?
					value ? 'Read.' : 'Unread.'
				: value ?
					'Starred.'
				:
					'Not starred.'
			)
		} catch (error) {
			status = ''
			operationError = errorDisplayMessage(error)
		}
	}


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
</script>


<section data-card data-column="gap-2">
	<header data-row="between wrap align-center gap-2">
		<h2>RSS item state</h2>
	</header>

	<ResourceBoundary resource={itemState}>
		{#snippet children(entity)}
			<div data-row="wrap gap-2">
				<button
					type="button"
					onclick={() => persistFlag('isRead', entity.isRead !== true)}
				>
					{entity.isRead === true ? 'Mark unread' : 'Mark read'}
				</button>
				<button
					type="button"
					onclick={() => persistFlag('isStarred', entity.isStarred !== true)}
				>
					{entity.isStarred === true ? 'Unstar' : 'Star'}
				</button>
			</div>
		{/snippet}
	</ResourceBoundary>

	{#if status !== ''}
		<p role="status">{status}</p>
	{/if}
	{#if operationError !== ''}
		<p role="alert">{operationError}</p>
	{/if}
</section>
