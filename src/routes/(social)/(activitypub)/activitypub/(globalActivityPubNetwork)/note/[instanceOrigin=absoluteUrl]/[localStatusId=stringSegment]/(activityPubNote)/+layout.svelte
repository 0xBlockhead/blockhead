<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()

	const detailHref = $derived(
		resolve(
			'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]',
			{
				instanceOrigin: params.instanceOrigin,
				localStatusId: params.localStatusId,
			}
		)
	)
	const detailSelection = $derived(data?.selector == null ? undefined : select(EntityType.ActivityPubNote, data.selector, {
		sources: [
			Source.Mastodon_Rest,
		],
	}))


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import ActivityPubNoteView from '$/views/ActivityPubNoteView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{#if detailSelection != null}
			<ActivityPubNoteView
				selection={detailSelection}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/if}
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
