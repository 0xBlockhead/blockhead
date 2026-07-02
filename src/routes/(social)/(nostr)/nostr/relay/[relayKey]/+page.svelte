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
	import NostrRelayView from '$/views/NostrRelayView.svelte'
</script>


<svelte:head>
	<title>Nostr relay • Blockhead</title>
</svelte:head>


<Page>
	<NostrRelayView
		href={
			resolve('/(social)/(nostr)/nostr/relay/[relayKey]', {
				relayKey: params.relayKey,
			})
		}
		selection={
			select(EntityType.NostrRelay, data.selector, {
				fields: {
					name: true,
					description: true,
					software: true,
					version: true,
					supportedNipCount: true,
					isPaid: true,
					limit: true,
				},
			})
		}
	/>
</Page>
