<script lang="ts">
	// Types/constants
	import { EntityLayout } from '$/components/EntityView.svelte'
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


	// Components
	import ActivityPubNoteView from '$/views/ActivityPubNoteView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
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
			entityId={{
				instanceOrigin: decodeURIComponent(instanceOrigin),
				localStatusId: decodeURIComponent(localStatusId),
			}}
			href={resolve('/(social)/(activitypub)/activitypub/note/[instanceOrigin]/[localStatusId]', {
				instanceOrigin: encodeURIComponent(instanceOrigin),
				localStatusId: encodeURIComponent(localStatusId),
			})}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
