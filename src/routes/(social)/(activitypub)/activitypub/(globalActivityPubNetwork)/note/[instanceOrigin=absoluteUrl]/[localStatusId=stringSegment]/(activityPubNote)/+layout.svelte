<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import ActivityPubNoteView from '$/views/ActivityPubNoteView.svelte'
</script>


{#key [params.instanceOrigin, params.localStatusId].join(':')}
	<ParentPageCollapsible
		href={
			resolve(
				'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]',
				{
					instanceOrigin: String(params.instanceOrigin),
					localStatusId: String(params.localStatusId),
				}
			)
		}
	>
		{#snippet Summary()}
			<ActivityPubNoteView
				selection={
					select(EntityType.ActivityPubNote, data.selector, { sources: [
						Source.Mastodon_Rest,
					] })
				}
				href={
					resolve(
						'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/note/[instanceOrigin=absoluteUrl]/[localStatusId=stringSegment]',
						{
							instanceOrigin: String(params.instanceOrigin),
							localStatusId: String(params.localStatusId),
						}
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
