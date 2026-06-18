<script lang="ts">
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import CoinsView from '$/views/CoinsView.svelte'
</script>


<Page>
	<CoinsView
		href={resolve('/coins')}
		selection={select(
			EntityType._Global,
			{ scope: '$$coins' }
		).$$coins}
		id="coins"
		limit={120}
	/>
</Page>
