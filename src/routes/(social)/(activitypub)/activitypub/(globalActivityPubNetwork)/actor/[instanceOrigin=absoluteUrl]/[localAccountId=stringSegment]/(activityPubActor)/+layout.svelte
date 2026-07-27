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
	import ActivityPubActorView from '$/views/ActivityPubActorView.svelte'
</script>


{#key [params.instanceOrigin, params.localAccountId].join(':')}
	<ParentPageCollapsible
		href={
			resolve(
				'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]',
				{
					instanceOrigin: String(params.instanceOrigin),
					localAccountId: String(params.localAccountId),
				}
			)
		}
	>
		{#snippet Summary()}
			<ActivityPubActorView
				selection={
					select(EntityType.ActivityPubActor, data.selector, { sources: [
						Source.Mastodon_Rest,
					] })
				}
				href={
					resolve(
						'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/actor/[instanceOrigin=absoluteUrl]/[localAccountId=stringSegment]',
						{
							instanceOrigin: String(params.instanceOrigin),
							localAccountId: String(params.localAccountId),
						}
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
