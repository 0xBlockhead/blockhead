<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import MarketsView from '$/views/MarketsView.svelte'
</script>


<svelte:head>
	<title>Markets</title>
</svelte:head>


<Page>
	<MarketsView
		href={resolve('/markets')}
		selection={select(
			EntityType._Global,
			{ scope: '$$markets' }
		).$$markets}
		open
	/>
</Page>
