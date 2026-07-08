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
			}).$$xUsers({
				sources: [
					Source.X_FxEmbed_Rest,
				],
			})
		}
		id='x-users'
	/>
</Page>
