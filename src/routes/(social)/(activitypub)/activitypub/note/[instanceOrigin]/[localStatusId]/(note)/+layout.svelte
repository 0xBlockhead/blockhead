<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let { children } = $props()

	const instanceOrigin = $derived(
		page.params.instanceOrigin ?? '',
	)

	const localStatusId = $derived(
		page.params.localStatusId ?? '',
	)


	// Functions
	import { select } from '$/routes/+layout.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import ActivityPubNoteView from '$/views/ActivityPubNoteView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]', {
		instanceOrigin: encodeURIComponent(instanceOrigin),
		localStatusId: encodeURIComponent(localStatusId),
	})}
	id={`${instanceOrigin}:${localStatusId}`}
>
	{#snippet Summary({ open: _open })}
		<ActivityPubNoteView
			selection={
				select(
					EntityType.ActivityPubNote,
					{
						instanceOrigin: decodeURIComponent(instanceOrigin),
						localStatusId: decodeURIComponent(localStatusId),
					}
				)
			}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
