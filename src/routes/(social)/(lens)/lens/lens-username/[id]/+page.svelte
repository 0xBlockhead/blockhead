<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LensUsernameView from '$/views/LensUsernameView.svelte'
</script>


<Page>
	<LensUsernameView
		selection={select(EntityType.LensUsername, data.selector)}
	/>
</Page>
