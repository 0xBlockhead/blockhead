<script lang="ts">
	import type { PageProps } from './$types.ts'

	// Context
	import { resolve } from '$app/paths'


	// Props
	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NostrRelayView from '$/views/NostrRelayView.svelte'
</script>


<Page>
	<NostrRelayView
		entityId={data.entityId}
		href={resolve('/(social)/(nostr)/nostr/relay/[relayKey]', {
			relayKey: encodeURIComponent(data.entityId.relayUrl),
		})}
	/>
</Page>
