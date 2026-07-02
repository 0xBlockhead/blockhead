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
	import NostrNotesView from '$/views/NostrNotesView.svelte'
</script>


<svelte:head>
	<title>Nostr notes • Blockhead</title>
</svelte:head>


<Page>
	<NostrNotesView
		href={resolve('/(social)/(nostr)/nostr/notes')}
		title='Nostr notes'
		selection={
			select(EntityType._GlobalNostrNetwork, {
				scope: '_GlobalNostrNetwork',
			})[EntityProxyField]<EntityType.NostrNote>('$$sourceWindowNotes')
		}
		id='NostrNotesView-page'
	/>
</Page>
