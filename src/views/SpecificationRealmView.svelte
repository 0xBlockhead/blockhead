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
			'realm',
			'label',
			'slug',
		],
		content: {
			dl: [
				[
					'realm',
					'label',
					{
						label: 'plural label',
					},
					'slug',
					{
						label: 'proposal kind count',
					},
					{
						label: 'proposal count',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Proposal kinds',
					items: [
						{
							label: 'SpecificationProposalKind rows',
						},
					],
				},
				{
					label: 'Proposals',
					items: [
						{
							label: 'SpecificationProposal rows in this realm',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'checked-in realm catalog',
						},
						{
							label: 'source repositories for proposals',
						},
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
			selection: EntityProxyResource<typeof schema, EntityType.SpecificationRealm>
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
	entityType={EntityType.SpecificationRealm}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
