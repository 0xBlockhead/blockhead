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
	import XUsersView from '$/views/XUsersView.svelte'
</script>


<svelte:head>
	<title>X users • Blockhead</title>
</svelte:head>


<Page>
	<XUsersView
		href={resolve('/(social)/(x)/x/users')}
		title='X users'
		selection={
			select(EntityType.XNetwork, {
				scope: 'XNetwork',
			})[EntityProxyField]<EntityType.XUser>('$$xUsers')
		}
		id='XUsersView-page'
	/>
</Page>
