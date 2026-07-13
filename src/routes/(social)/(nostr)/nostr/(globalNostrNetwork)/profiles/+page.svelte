<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import NostrProfilesView from '$/views/NostrProfilesView.svelte'
</script>


<svelte:head>
	<title>Nostr profiles • Blockhead</title>
</svelte:head>


<Page>
	<NostrProfilesView
		href={resolve('/nostr/profiles')}
		title='Nostr profiles'
		selection={
			select(EntityType._GlobalNostrNetwork, {
				scope: '_GlobalNostrNetwork',
			}).$$observedProfiles({
				sources: [
					Source.NostrBand_Rest,
				],
			})
		}
		id='observed-profiles'
	/>
</Page>
