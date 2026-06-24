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
			'hash',
		],
		content: {
			dl: [
				[
					'hash',
					'blockSlot',
					'fee',
					'deposit',
					'sizeBytes',
					'validityStartSlot',
					'ttlSlot',
					'metadata',
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'inputs',
					when: 'open',
					items: [
						'$$inputs',
					],
				},
				{
					label: 'outputs',
					when: 'open',
					items: [
						'$$outputs',
					],
				},
				{
					label: 'certificates',
					when: 'open',
					items: [
						'$$certificates',
					],
				},
				{
					label: 'scripts',
					when: 'open',
					items: [
						'$$scripts',
					],
				},
				{
					label: 'governance proposals',
					when: 'open',
					items: [
						'$$governanceProposals',
					],
				},
				{
					label: 'governance votes',
					when: 'open',
					items: [
						'$$governanceVotes',
					],
				},
				{
					label: 'assets',
					when: 'open',
					items: [
						'$$assets',
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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoTransaction>
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
	entityType={EntityType.CardanoTransaction}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
