<!-- Generated from APP.ts. -->

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

	const detailHref = $derived(
		resolve(
			'/(social)/(activitypub)/activitypub/(globalActivityPubNetwork)/instance/[instanceOrigin=absoluteUrl]/(activityPubInstance)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
			{
				instanceOrigin: params.instanceOrigin,
				timestampMs: params.timestampMs,
				source: params.source,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import ActivityPubInstance_TimestampView from '$/views/ActivityPubInstance_TimestampView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		<ActivityPubInstance_TimestampView
			selection={
				select(EntityType.ActivityPubInstance_Timestamp, data.selector, {
					sources: [
						Source.Mastodon_Rest,
					],
				})
			}
			href={detailHref}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
