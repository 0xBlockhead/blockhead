<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/$EntityType.ts'


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
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$markets',
		}}
		open
	/>
</Page>
