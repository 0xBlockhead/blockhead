<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import GlobalAtprotoNetwork_TimestampView from '$/views/_GlobalAtprotoNetwork_TimestampView.svelte'
</script>


<svelte:head>
	<title>AT Protocol hub observation • Blockhead</title>
</svelte:head>


<Page>
	<GlobalAtprotoNetwork_TimestampView
		href={
			resolve('/(social)/(atproto)/atproto/observations/[timestampMs=nonNegativeInteger]/[source]', {
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType._GlobalAtprotoNetwork_Timestamp, data.selector, {
				fields: {
					sourceWindowActorCount: true,
					sourceWindowPostCount: true,
					reachable: true,
				},
			})
		}
	/>
</Page>
