<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		closed: [],
		content: {
			dl: [
				[],
			],
		},
		details: {
			tabs: [
				{
					label: 'blocks',
					when: 'open',
					items: [
						'$$blocks',
					],
				},
				{
					label: 'transactions',
					when: 'open',
					items: [
						'$$transactions',
					],
				},
				{
					label: 'addresses',
					when: 'open',
					items: [
						'$$addresses',
					],
				},
				{
					label: 'stake credentials',
					when: 'open',
					items: [
						'$$stakeCredentials',
					],
				},
				{
					label: 'stake pools',
					when: 'open',
					items: [
						'$$stakePools',
					],
				},
				{
					label: 'd reps',
					when: 'open',
					items: [
						'$$dReps',
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
					label: 'assets',
					when: 'open',
					items: [
						'$$assets',
					],
				},
				{
					label: 'protocol parameter epochs',
					when: 'open',
					items: [
						'$$protocolParameterEpochs',
					],
				},
				{
					label: 'constitution epochs',
					when: 'open',
					items: [
						'$$constitutionEpochs',
					],
				},
				{
					label: 'committee epochs',
					when: 'open',
					items: [
						'$$committeeEpochs',
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
			selection: EntityProxyResource<typeof schema, EntityType.CardanoNetwork>
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
	entityType={EntityType.CardanoNetwork}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
