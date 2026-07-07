<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NostrRelayView from '$/views/NostrRelayView.svelte'
</script>


<Page>
	<NostrRelayView
		href={
			resolve('/(social)/(nostr)/nostr/relay/[relayKey]', {
				relayKey: params.relayKey,
			})
		}
		selection={
			select(EntityType.NostrRelay, {
				relayUrl: decodeURIComponent(params.relayKey),
			}, {
				sources: [
					Source.Constants_Internal,
				],
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
