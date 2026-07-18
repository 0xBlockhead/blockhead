<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.ActivityPubInstance, data.selector, {
		sources: [
			Source.Mastodon_Rest,
		],
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.instanceOrigin) ?? '')].filter(Boolean).join(' ') || 'ActivityPub instance' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).instanceOrigin) ?? '')].filter(Boolean).join(' ') || 'ActivityPub instance')))


	// Components
	import Page from '$/components/Page.svelte'
	import ActivityPubInstanceView from '$/views/ActivityPubInstanceView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • ActivityPub instance • Blockhead</title>
</svelte:head>


<Page>
	<ActivityPubInstanceView
		href={
			resolve('/activitypub/instance/[instanceOrigin=absoluteUrl]', {
				instanceOrigin: params.instanceOrigin,
			})
		}
		selection={pageSelection}
	/>
</Page>
