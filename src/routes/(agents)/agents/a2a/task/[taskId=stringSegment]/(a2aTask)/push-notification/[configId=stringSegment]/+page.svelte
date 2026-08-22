<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.A2aPushNotificationConfig, {
		$task: data.selector,
		configId: params.configId,
	}, {
		sources: [],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import A2aPushNotificationConfigView from '$/views/A2aPushNotificationConfigView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.configId || 'A2A push notification config')} • A2A push notification config • Blockhead</title>
</svelte:head>


<Page>
	<A2aPushNotificationConfigView
		selection={pageSelection}
	/>
</Page>
