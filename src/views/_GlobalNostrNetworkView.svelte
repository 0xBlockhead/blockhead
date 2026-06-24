<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		closed: [
			'scope',
		],
		content: {
			dl: [
				[
					'scope',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'source window profiles',
					when: 'open',
					items: [
						'$$sourceWindowProfiles',
					],
				},
				{
					label: 'source window notes',
					when: 'open',
					items: [
						'$$sourceWindowNotes',
					],
				},
				{
					label: 'source window relays',
					when: 'open',
					items: [
						'$$sourceWindowRelays',
					],
				},
				{
					label: 'source window reposts',
					when: 'open',
					items: [
						'$$sourceWindowReposts',
					],
				},
				{
					label: 'source window articles',
					when: 'open',
					items: [
						'$$sourceWindowArticles',
					],
				},
				{
					label: 'timestamps',
					when: 'open',
					items: [
						'$$timestamps',
					],
				},
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType._GlobalNostrNetwork>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType._GlobalNostrNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
