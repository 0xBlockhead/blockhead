<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import NostrRelaysView from '$/views/NostrRelaysView.svelte'
</script>


<svelte:head>
	<title>Nostr relays • Blockhead</title>
</svelte:head>


<Page>
	<NostrRelaysView
		href={resolve('/(social)/(nostr)/nostr/relays')}
		title='Nostr relays'
		selection={
			select(EntityType._GlobalNostrNetwork, {
				scope: '_GlobalNostrNetwork',
			})[EntityProxyField]<EntityType.NostrRelay>('$$observedRelays', {
				sources: [
					Source.Constants_Internal,
					Source.NostrBand_Rest,
				],
			})
		}
		id='observed-relays'
	/>
</Page>
