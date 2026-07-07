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
	import GlobalActivityPubNetworkView from '$/views/_GlobalActivityPubNetworkView.svelte'
</script>


<Page>
	<GlobalActivityPubNetworkView
		href={resolve('/(social)/(activitypub)/activitypub')}
		selection={
			select(EntityType._GlobalActivityPubNetwork, {
				scope: '_GlobalActivityPubNetwork',
			}, {
				sources: [
					Source.Constants_Internal,
					Source.Mastodon_Rest,
				],
			})
		}
	/>
</Page>
