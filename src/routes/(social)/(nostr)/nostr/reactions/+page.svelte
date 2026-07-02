<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import NostrReactionsView from '$/views/NostrReactionsView.svelte'
</script>


<svelte:head>
	<title>Nostr reactions • Blockhead</title>
</svelte:head>


<Page>
	<NostrReactionsView
		href={resolve('/(social)/(nostr)/nostr/reactions')}
		title='Nostr reactions'
		selection={
			select(EntityType._GlobalNostrNetwork, {
				scope: '_GlobalNostrNetwork',
			})[EntityProxyField]<EntityType.NostrReaction>('$$sourceWindowReactions')
		}
		id='NostrReactionsView-page'
	/>
</Page>
