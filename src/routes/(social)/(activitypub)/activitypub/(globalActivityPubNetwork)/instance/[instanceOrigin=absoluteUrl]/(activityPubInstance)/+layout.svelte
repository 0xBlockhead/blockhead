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
	import ActivityPubInstanceView from '$/views/ActivityPubInstanceView.svelte'
</script>


{#key params.instanceOrigin}
	<ParentPageCollapsible
		href={
			resolve('/activitypub/instance/[instanceOrigin=absoluteUrl]', {
				instanceOrigin: params.instanceOrigin,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = ActivityPubInstanceView}

			<DetailView
				selection={select(EntityType.ActivityPubInstance, data.selector, { sources: [
		Source.Mastodon_Rest,
	] })}
				href={
					resolve('/activitypub/instance/[instanceOrigin=absoluteUrl]', {
						instanceOrigin: params.instanceOrigin,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
