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
	import MarketsView from '$/views/MarketsView.svelte'
</script>


<svelte:head>
	<title>Markets • Blockhead</title>
</svelte:head>


<Page>
	<MarketsView
		href={resolve('/markets')}
		title='Markets'
		selection={
			select(EntityType._Global, {
				scope: '$$markets',
			}).$$markets({
				sources: [
					Source.Constants_Internal,
				],
				count: true,
			})
		}
		id='markets'
	/>
</Page>
