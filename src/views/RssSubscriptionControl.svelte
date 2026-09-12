<script lang="ts">
	import type { EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { errorDisplayMessage } from '$/lib/errors.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import {
		deleteLocalRssSubscription,
		writeLocalRssSubscription,
	} from '$/collections/localMutations.ts'
	import { serializeRssOpml } from '$/lib/rssOpmlExport.ts'
	import { getAppClient } from '$/routes/applicationClient.ts'

	let {
		selection,
	}: Pick<EntitySelectionViewProps<EntityType.RssNetwork>, 'selection'> = $props()

	let feedUrl = $state('')
	let title = $state('')
	let status = $state('')
	let operationError = $state('')

	const subscriptions = $derived(selection.$$rssFeeds({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			title: true,
		},
	}))

	const downloadSubscriptions = (values: NonNullable<typeof subscriptions.current>['values']) => {
		const content = serializeRssOpml(values.map((subscription) => ({
			feedUrl: subscription[EntityMetaKey.Selector].feedUrl,
			title: subscription.title,
		})))
		const objectUrl = URL.createObjectURL(new Blob([content], {
			type: 'application/xml;charset=utf-8',
		}))
		const link = document.createElement('a')
		link.href = objectUrl
		link.download = 'blockhead-rss-subscriptions.opml'
		link.click()
		URL.revokeObjectURL(objectUrl)
	}
</script>


<section data-card data-column="gap-2">
	<header data-row="between wrap align-center gap-2">
		<h2>RSS subscriptions</h2>
	</header>

	<form
		data-column="gap-2"
		onsubmit={async (event) => {
			event.preventDefault()
			operationError = ''
			try {
				const operation = event.submitter?.getAttribute('value')
				if (operation === 'remove')
					await deleteLocalRssSubscription(getAppClient(), feedUrl)
				else
					await writeLocalRssSubscription(getAppClient(), { feedUrl, title })
				status = operation === 'remove' ? 'Subscription removed.' : 'Subscription saved.'
				feedUrl = ''
				title = ''
			} catch (error) {
				status = ''
				operationError = errorDisplayMessage(error)
			}
		}}
	>
		<label for="rss-subscription-feed-url">Feed URL</label>
		<input
			id="rss-subscription-feed-url"
			name="feedUrl"
			type="url"
			bind:value={feedUrl}
			required
		/>

		<label for="rss-subscription-title">Title</label>
		<input
			id="rss-subscription-title"
			name="title"
			bind:value={title}
		/>

		<div data-row="wrap gap-2">
			<button type="submit" value="add">Save subscription</button>
			<button type="submit" value="remove">Remove subscription</button>
		</div>
	</form>

	<ResourceBoundary resource={subscriptions}>
		{#snippet children({ values })}
			<button
				type="button"
				disabled={values.length === 0}
				onclick={() => downloadSubscriptions(values)}
			>
				Export OPML
			</button>
		{/snippet}
	</ResourceBoundary>

	{#if status !== ''}
		<p role="status">{status}</p>
	{/if}
	{#if operationError !== ''}
		<p role="alert">{operationError}</p>
	{/if}
</section>
