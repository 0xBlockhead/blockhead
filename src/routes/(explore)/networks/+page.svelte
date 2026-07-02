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
	import NetworksView from '$/views/NetworksView.svelte'
</script>


<svelte:head>
	<title>Networks • Blockhead</title>
</svelte:head>


<Page>
	<NetworksView
		href={resolve('/(explore)/networks')}
		title='Networks'
		selection={
			select(EntityType._Global, {
				scope: '$$networks',
			})[EntityProxyField]<EntityType.Network>('$$networks')
		}
		id='NetworksView-page'
	/>
</Page>
